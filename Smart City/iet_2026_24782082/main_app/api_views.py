from django.db.models import Q

from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Report
from .serializers import ReportSerializer
from .permissions import IsOwnerDraftPermission


class ReportViewSet(viewsets.ModelViewSet):
    serializer_class = ReportSerializer

    def get_queryset(self):
        user = self.request.user

        if user.is_staff:
            return Report.objects.exclude(status='DRAFT')

        return Report.objects.filter(reporter=user)

    def get_permissions(self):
        if self.action in ['update', 'partial_update', 'destroy']:
            return [
                permissions.IsAuthenticated(),
                IsOwnerDraftPermission()
            ]

        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save(reporter=self.request.user)

    @action(detail=True, methods=['patch'])
    def submit(self, request, pk=None):
        report = self.get_object()

        if report.reporter != request.user:
            return Response(
                {'detail': 'Anda hanya bisa submit laporan milik sendiri.'},
                status=status.HTTP_403_FORBIDDEN
            )

        if report.status != 'DRAFT':
            return Response(
                {'detail': 'Hanya laporan DRAFT yang bisa disubmit.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        report.status = 'REPORTED'
        report.save()

        return Response({
            'detail': 'Laporan berhasil disubmit.',
            'status': report.status
        })

    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        report = self.get_object()

        if not request.user.is_staff:
            return Response(
                {'detail': 'Hanya admin yang dapat mengubah status laporan.'},
                status=status.HTTP_403_FORBIDDEN
            )

        new_status = request.data.get('status')

        allowed_status = [
            'VERIFIED',
            'IN_PROGRESS',
            'RESOLVED'
        ]

        if new_status not in allowed_status:
            return Response(
                {'detail': 'Status tidak valid untuk admin.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if report.status == 'DRAFT':
            return Response(
                {'detail': 'Admin tidak dapat memproses laporan DRAFT.'},
                status=status.HTTP_403_FORBIDDEN
            )

        report.status = new_status
        report.save()

        return Response({
            'detail': 'Status laporan berhasil diperbarui.',
            'status': report.status
        })