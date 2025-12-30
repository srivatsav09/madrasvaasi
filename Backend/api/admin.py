from django.contrib import admin
from .models import Location, ForumPost, Comment, Event, TourismCategory, Area, Attraction

@admin.register(Location)
class LocationAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    search_fields = ('name',)

@admin.register(ForumPost)
class ForumPostAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'user', 'location', 'created_at')
    list_filter = ('location', 'created_at')
    search_fields = ('title', 'content', 'user__username')
    date_hierarchy = 'created_at'
    readonly_fields = ('created_at',)

@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'post', 'created_at', 'content_preview')
    list_filter = ('created_at',)
    search_fields = ('content', 'user__username', 'post__title')
    date_hierarchy = 'created_at'
    readonly_fields = ('created_at',)

    def content_preview(self, obj):
        return obj.content[:50] + '...' if len(obj.content) > 50 else obj.content
    content_preview.short_description = 'Content Preview'

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('id', 'Event_Title', 'Location', 'start_date', 'end_date')
    list_filter = ('start_date', 'end_date', 'Location')
    search_fields = ('Event_Title', 'Event_Details', 'Location')
    date_hierarchy = 'start_date'


# Tourism Admin

@admin.register(TourismCategory)
class TourismCategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'icon', 'get_attraction_count')
    search_fields = ('name',)

    def get_attraction_count(self, obj):
        return obj.attractions.count()
    get_attraction_count.short_description = 'Attractions'


@admin.register(Area)
class AreaAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'get_attraction_count')
    search_fields = ('name',)

    def get_attraction_count(self, obj):
        return obj.attractions.count()
    get_attraction_count.short_description = 'Attractions'


@admin.register(Attraction)
class AttractionAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'category', 'area', 'is_featured', 'entry_fee', 'timings')
    list_filter = ('category', 'area', 'is_featured')
    search_fields = ('name', 'description', 'short_description', 'address')
    list_editable = ('is_featured',)
    readonly_fields = ('created_at', 'updated_at')

    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'category', 'area', 'short_description', 'description')
        }),
        ('Location Details', {
            'fields': ('address', 'latitude', 'longitude')
        }),
        ('Visitor Information', {
            'fields': ('entry_fee', 'timings', 'best_time_to_visit')
        }),
        ('Media & Links', {
            'fields': ('image_url', 'website')
        }),
        ('Settings', {
            'fields': ('is_featured', 'created_at', 'updated_at')
        }),
    )
