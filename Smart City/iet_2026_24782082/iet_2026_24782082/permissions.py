from rest_framework import permissions


class IsOwnerDraftPermission(permissions.BasePermission):
    """
    Citizen hanya bisa edit/delete report sendiri
    dengan status DRAFT.
    """

    def has_object_permission(self, request, view, obj):

        # GET boleh
        if request.method in permissions.SAFE_METHODS:
            return True

        # Admin tidak boleh edit/delete isi report
        if request.user.is_staff:
            return False

        # Citizen hanya owner + DRAFT
        return (
            obj.reporter == request.user
            and obj.status == 'DRAFT'
        )