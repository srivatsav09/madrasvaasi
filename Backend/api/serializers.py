from rest_framework import serializers
from .models import ForumPost, Comment, Event, Location, TourismCategory, Area, Attraction, HelplineCategory, Helpline

# serializers.py

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ['Event_Title', 'Event_Link', 'Event_Details', 'start_date','end_date', 'Location', 'Image_Source']

#forum
        
from rest_framework import serializers
from .models import Location, ForumPost, Comment

class LocationSerializer(serializers.ModelSerializer):
    post_count = serializers.SerializerMethodField()
    class Meta:
        model = Location
        fields = ('id', 'name', 'post_count')

    def get_post_count(self, obj):
        return ForumPost.objects.filter(location=obj).count()

class LocationPostCountSerializer(serializers.ModelSerializer):
    post_count = serializers.SerializerMethodField()

    class Meta:
        model = Location
        fields = ('id', 'name', 'post_count')

    def get_post_count(self, obj):
        return ForumPost.objects.filter(location=obj).count()

class CommentSerializer(serializers.ModelSerializer):
    #user_name = serializers.CharField(source='user.username', read_only=True)
    class Meta:
        model = Comment
        fields = ('id', 'user', 'post', 'content', 'created_at')

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['location_id'] = instance.post.location.id  # Include the location ID in the serialized data
        return data
        

class PostSerializer(serializers.ModelSerializer):
    comments = CommentSerializer(many=True, read_only=True)
    #user_name = serializers.CharField(source='user.username', read_only=True)
    class Meta:
        model = ForumPost
        fields = ('id', 'user', 'location', 'title', 'content', 'created_at', 'comments')

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['location_id'] = instance.location.id  # Include the location ID in the serialized data
        return data


# Tourism Serializers

class TourismCategorySerializer(serializers.ModelSerializer):
    attraction_count = serializers.SerializerMethodField()

    class Meta:
        model = TourismCategory
        fields = ('id', 'name', 'description', 'icon', 'attraction_count')

    def get_attraction_count(self, obj):
        return obj.attractions.count()


class AreaSerializer(serializers.ModelSerializer):
    attraction_count = serializers.SerializerMethodField()

    class Meta:
        model = Area
        fields = ('id', 'name', 'description', 'attraction_count')

    def get_attraction_count(self, obj):
        return obj.attractions.count()


class AttractionListSerializer(serializers.ModelSerializer):
    """Simplified serializer for list views"""
    category_name = serializers.CharField(source='category.name', read_only=True)
    area_name = serializers.CharField(source='area.name', read_only=True)

    class Meta:
        model = Attraction
        fields = (
            'id', 'name', 'category', 'category_name', 'area', 'area_name',
            'short_description', 'image_url', 'entry_fee', 'timings',
            'is_featured', 'latitude', 'longitude'
        )


class AttractionDetailSerializer(serializers.ModelSerializer):
    """Detailed serializer with all information"""
    category = TourismCategorySerializer(read_only=True)
    area = AreaSerializer(read_only=True)

    class Meta:
        model = Attraction
        fields = (
            'id', 'name', 'category', 'area', 'description', 'short_description',
            'address', 'latitude', 'longitude', 'image_url', 'website',
            'entry_fee', 'timings', 'best_time_to_visit', 'is_featured',
            'created_at', 'updated_at'
        )


# Helpline Serializers

class HelplineCategorySerializer(serializers.ModelSerializer):
    helpline_count = serializers.SerializerMethodField()

    class Meta:
        model = HelplineCategory
        fields = ('id', 'name', 'description', 'icon', 'priority', 'helpline_count')

    def get_helpline_count(self, obj):
        return obj.helplines.count()


class HelplineListSerializer(serializers.ModelSerializer):
    """Simplified serializer for list views"""
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_icon = serializers.CharField(source='category.icon', read_only=True)
    area_name = serializers.CharField(source='area.name', read_only=True)

    class Meta:
        model = Helpline
        fields = (
            'id', 'name', 'category', 'category_name', 'category_icon',
            'area', 'area_name', 'phone_number', 'alternate_number',
            'address', 'timings', 'is_emergency', 'is_toll_free',
            'latitude', 'longitude'
        )


class HelplineDetailSerializer(serializers.ModelSerializer):
    """Detailed serializer with all information"""
    category = HelplineCategorySerializer(read_only=True)
    area = AreaSerializer(read_only=True)

    class Meta:
        model = Helpline
        fields = (
            'id', 'name', 'category', 'area', 'phone_number', 'alternate_number',
            'email', 'address', 'latitude', 'longitude', 'description',
            'timings', 'is_emergency', 'is_toll_free', 'created_at', 'updated_at'
        )
