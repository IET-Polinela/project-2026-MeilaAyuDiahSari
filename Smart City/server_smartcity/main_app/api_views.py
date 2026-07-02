from django.db.models import Q
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response

from .models import Report
from .serializers import ReportSerializer
from .permissions import IsOwnerDraftPermission

from drf_spectacular.utils import extend_schema


class ReportPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 1000


class ReportViewSet(viewsets.ModelViewSet):
    serializer_class = ReportSerializer
    pagination_class = ReportPagination

    def get_queryset(self):
        user = self.request.user
        tab = self.request.query_params.get('tab', None)

        queryset = Report.objects.all().order_by('-updated_at')

        if not user or not user.is_authenticated:
            return queryset.exclude(status='DRAFT')

        # Jika pengguna adalah staff/admin
        if getattr(user, 'is_staff', False):
            if tab == 'my_reports':
                return queryset.filter(reporter=user)
            if tab == 'feed':
                return queryset.exclude(status='DRAFT')
            # Admin tidak boleh melihat draf milik orang lain
            return queryset.filter(Q(reporter=user) | ~Q(status='DRAFT'))

        # Jika pengguna adalah warga biasa
        if tab == 'my_reports':
            return queryset.filter(reporter=user)

        if tab == 'feed':
            return queryset.exclude(status='DRAFT')

        # Penentu PRIV-03 & PRIV-04: Warga biasa tidak bisa mendeteksi keberadaan DRAFT milik warga lain (404)
        return queryset.filter(
            Q(reporter=user) | ~Q(status='DRAFT')
        )
    
    # ─── TAMBAHKAN FUNGSI INI DI BAWAH GET_QUERYSET ───
    def get_object(self):
        """
        Memastikan jika user mencoba mengakses/mengubah detail draf orang lain,
        DRF langsung melempar Http404 (Bukan 200 atau 403) sesuai keinginan test.
        """
        obj = super().get_object()
        user = self.request.user
        
        # Jika objek berstatus DRAFT dan pengakses bukan pemilik laporan serta bukan admin
        if obj.status == 'DRAFT' and obj.reporter != user and not getattr(user, 'is_staff', False):
            from django.http import Http404
            raise Http404("Draf milik pengguna lain tidak ditemukan.")
            
        return obj

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

    @extend_schema(exclude=True)
    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        report = self.get_object()

        if not request.user.is_staff:
            return Response(
                {'detail': 'Hanya admin yang dapat mengubah status laporan.'},
                status=status.HTTP_403_FORBIDDEN
            )

        new_status = request.data.get('status')
        allowed_status = ['VERIFIED', 'IN_PROGRESS', 'RESOLVED']

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