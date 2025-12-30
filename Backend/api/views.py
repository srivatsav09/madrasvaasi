from rest_framework import generics, permissions
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from django.http import JsonResponse
from django.db import IntegrityError
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from rest_framework import generics, permissions
from rest_framework.response import Response
from .models import ForumPost, Comment
#from .serializers import ForumPostSerializer, CommentSerializer , LocationSerializer
from .models import Event
from .serializers import EventSerializer
from .permissions import IsOwnerOrReadOnly
import csv
from .models import Event,Location
from datetime import datetime

from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import permission_classes
from rest_framework_simplejwt.tokens import RefreshToken
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from rest_framework.decorators import api_view

@csrf_exempt
@swagger_auto_schema(method='post', request_body=openapi.Schema(
    type=openapi.TYPE_OBJECT,
    required=['username', 'password'],
    properties={
        'username': openapi.Schema(type=openapi.TYPE_STRING),
        'password': openapi.Schema(type=openapi.TYPE_STRING)
    }
))
@api_view(['POST'])
def signup(request):
    if request.method == 'POST':
        try:
            data = JSONParser().parse(request)
            user = User.objects.create_user(data['username'], password=data['password'])
            user.save()
            refresh = RefreshToken.for_user(user)
            return JsonResponse({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }, status=status.HTTP_201_CREATED)
        except IntegrityError:
            return JsonResponse({'error': 'That username has already been taken. Please choose a new username'}, status=status.HTTP_400_BAD_REQUEST)
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)


@csrf_exempt
@swagger_auto_schema(method='post', request_body=openapi.Schema(
    type=openapi.TYPE_OBJECT,
    required=['username', 'password'],
    properties={
        'username': openapi.Schema(type=openapi.TYPE_STRING),
        'password': openapi.Schema(type=openapi.TYPE_STRING)
    }
))
@api_view(['POST'])
def login(request):
    if request.method == 'POST':
        data = JSONParser().parse(request)
        user = authenticate(request, username=data['username'], password=data['password'])
        if user is None:
            return JsonResponse({'error':'Could not login. Please check username and password'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            refresh = RefreshToken.for_user(user)
            return JsonResponse({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }, status=status.HTTP_200_OK)
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

#Events

@permission_classes([IsAuthenticated])
class EventListAPIView(generics.ListAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer


@permission_classes([IsAuthenticated])
def import_events_from_csv(request):
    with open('C:/Users/sriva/madrasvaasi/Backend/event_data.csv') as file:
        csv_reader = csv.DictReader(file)
        #next(csv_reader)
        for row in csv_reader:
            # date = row['Date']
            # print(date)
            # date_parts = [part.strip() for part in date.split('-')]
            # print(date_parts)
            # start_date = datetime.strptime(date_parts[0], "%a %d %b %Y").strftime("%Y-%m-%d")
            # end_date = datetime.strptime(date_parts[1], "%a %d %b %Y").strftime("%Y-%m-%d")
            date = row.get('Date', '')  # Use get() to handle missing 'Date' key
            date_parts = [part.strip() for part in date.split('-')] if date else []

            if date_parts:
                try:
                    start_date = datetime.strptime(date_parts[0], "%a %d %b %Y").strftime("%Y-%m-%d")
                    end_date = datetime.strptime(date_parts[-1], "%a %d %b %Y").strftime("%Y-%m-%d")
                except ValueError as e:
                    print(f"Error parsing date for row {row}: {e}")
                    start_date = end_date = None
            Event.objects.create(
                Event_Title=row['Event Title'],
                Event_Link=row['Event Link'],
                Event_Details=row['Event Details'],
                start_date=start_date,
                end_date=end_date,
                Location=row['Location'],
                Image_Source=row['Image Source']
            )
    return JsonResponse({'message': 'Events imported successfully'})

#forum

from rest_framework import generics
from rest_framework import status
from rest_framework.response import Response
from .models import Location, ForumPost, Comment
from .serializers import LocationSerializer, PostSerializer, CommentSerializer
from .serializers import LocationPostCountSerializer

@permission_classes([IsAuthenticated])
class LocationListView(generics.ListCreateAPIView):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer

@permission_classes([IsAuthenticated])
class PostListView(generics.ListCreateAPIView):
    serializer_class = PostSerializer

    def get_queryset(self):
        location_id = self.kwargs['location_id']
        return ForumPost.objects.filter(location_id=location_id)

    def perform_create(self, serializer):
        location_id = self.kwargs['location_id']
        location = Location.objects.get(id=location_id)
        serializer.save(location=location)

@permission_classes([IsAuthenticated])
class PostDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ForumPost.objects.all()
    serializer_class = PostSerializer
    lookup_url_kwarg = 'post_id'  # Set the URL parameter name for the post ID

    def get_queryset(self):
        location_id = self.kwargs['location_id']
        return self.queryset.filter(location_id=location_id)

@permission_classes([IsAuthenticated])
class CommentListView(generics.ListCreateAPIView):
    serializer_class = CommentSerializer

    def get_queryset(self):
        post_id = self.kwargs['post_id']
        return Comment.objects.filter(post_id=post_id)

    def perform_create(self, serializer):
        post_id = self.kwargs['post_id']
        post = ForumPost.objects.get(id=post_id)
        serializer.save(post=post)

@permission_classes([IsAuthenticated])
class CommentDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['location_id'] = self.get_object().post.location.id
        return context

from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Location
from .serializers import LocationPostCountSerializer

@permission_classes([IsAuthenticated])
class LocationPostCountView(APIView):
    def get(self, request, location_id):
        location = Location.objects.get(id=location_id)
        serializer = LocationPostCountSerializer(location)
        return Response(serializer.data)


# Tourism Views

from .models import TourismCategory, Area, Attraction
from .serializers import (
    TourismCategorySerializer,
    AreaSerializer,
    AttractionListSerializer,
    AttractionDetailSerializer
)
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

@permission_classes([IsAuthenticated])
class TourismCategoryListView(generics.ListAPIView):
    """List all tourism categories"""
    queryset = TourismCategory.objects.all()
    serializer_class = TourismCategorySerializer


class AreaListView(generics.ListAPIView):
    """List all areas in Chennai - publicly accessible (used by helpline filters)"""
    queryset = Area.objects.all()
    serializer_class = AreaSerializer
    permission_classes = [AllowAny]


@permission_classes([IsAuthenticated])
class AttractionListView(generics.ListAPIView):
    """List all attractions with filtering options"""
    queryset = Attraction.objects.all()
    serializer_class = AttractionListSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['category', 'area', 'is_featured']
    search_fields = ['name', 'description', 'short_description']
    ordering_fields = ['name', 'created_at', 'is_featured']
    ordering = ['-is_featured', 'name']


@permission_classes([IsAuthenticated])
class AttractionDetailView(generics.RetrieveAPIView):
    """Get detailed information about a specific attraction"""
    queryset = Attraction.objects.all()
    serializer_class = AttractionDetailSerializer
    lookup_field = 'id'


@permission_classes([IsAuthenticated])
class FeaturedAttractionsView(generics.ListAPIView):
    """List only featured/popular attractions"""
    queryset = Attraction.objects.filter(is_featured=True)
    serializer_class = AttractionListSerializer
    ordering = ['name']


# Helpline Views

from .models import HelplineCategory, Helpline
from .serializers import (
    HelplineCategorySerializer,
    HelplineListSerializer,
    HelplineDetailSerializer
)

class HelplineCategoryListView(generics.ListAPIView):
    """List all helpline categories - publicly accessible"""
    queryset = HelplineCategory.objects.all()
    serializer_class = HelplineCategorySerializer
    permission_classes = [AllowAny]


class HelplineListView(generics.ListAPIView):
    """List all helplines with filtering options - publicly accessible"""
    queryset = Helpline.objects.all()
    serializer_class = HelplineListSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['category', 'area', 'is_emergency']
    search_fields = ['name', 'description', 'phone_number']
    ordering_fields = ['name', 'category__priority', 'is_emergency']
    ordering = ['-is_emergency', '-category__priority', 'name']
    permission_classes = [AllowAny]


class HelplineDetailView(generics.RetrieveAPIView):
    """Get detailed information about a specific helpline - publicly accessible"""
    queryset = Helpline.objects.all()
    serializer_class = HelplineDetailSerializer
    lookup_field = 'id'
    permission_classes = [AllowAny]


class EmergencyHelplinesView(generics.ListAPIView):
    """List only emergency (24/7) helplines - publicly accessible"""
    queryset = Helpline.objects.filter(is_emergency=True)
    serializer_class = HelplineListSerializer
    ordering = ['-category__priority', 'name']
    permission_classes = [AllowAny]
