from rest_framework import serializers
from .models import Report


class ReportSerializer(serializers.ModelSerializer):
    reporter = serializers.SerializerMethodField()
    reporter_name = serializers.SerializerMethodField()
    is_owner = serializers.SerializerMethodField()

    class Meta:
        model = Report
        fields = [
            'id',
            'title',
            'category',
            'description',
            'location',
            'status',
            'reporter',
            'reporter_name',
            'is_owner',
            'created_at',
            'updated_at',
        ]

    def get_reporter(self, obj):
        # Ketentuan PRIV-01: Di feed publik / response umum field reporter harus selalu disamarkan
        return "Warga Anonim"

    def get_reporter_name(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            if obj.reporter == request.user:
                return obj.reporter.get_full_name() or obj.reporter.username
        return "Warga Anonim"

    def get_is_owner(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.reporter == request.user
        return False