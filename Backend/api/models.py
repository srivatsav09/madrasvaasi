from django.db import models
from django.contrib.auth import get_user_model

class Location(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name

class ForumPost(models.Model):
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
    location = models.ForeignKey(Location, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class Comment(models.Model):
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
    post = models.ForeignKey(ForumPost, on_delete=models.CASCADE, related_name='comments')
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Comment by {self.user.username} on {self.post.title}"

# class MonthEvent(models.Model):
#     name = models.CharField(max_length=255)
#     description = models.TextField()

#     def __str__(self):
#         return self.name

# class Event(models.Model):
#     month = models.ForeignKey(MonthEvent, on_delete=models.CASCADE)
#     name = models.CharField(max_length=255)
#     description = models.TextField()
#     date = models.DateField()

#     def __str__(self):
#         return self.name
    

#Event Title,Event Link,Event Details,Date,Location,Image Source

class Event(models.Model):
    Event_Title = models.CharField(max_length=255)
    Event_Link = models.URLField()
    Event_Details = models.CharField(max_length=255)
    start_date = models.DateField()
    end_date = models.DateField()
    Location = models.CharField(max_length=255)
    Image_Source = models.URLField()

    def __str__(self):
        return self.Event_Title


# Tourism Models

class TourismCategory(models.Model):
    """Categories for tourist attractions (e.g., Temple, Beach, Museum)"""
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=50, blank=True, help_text="Icon name or emoji")

    class Meta:
        verbose_name_plural = "Tourism Categories"
        ordering = ['name']

    def __str__(self):
        return self.name


class Area(models.Model):
    """Areas/neighborhoods in Chennai"""
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name


class Attraction(models.Model):
    """Tourist attractions in Chennai"""
    name = models.CharField(max_length=255)
    category = models.ForeignKey(TourismCategory, on_delete=models.CASCADE, related_name='attractions')
    area = models.ForeignKey(Area, on_delete=models.SET_NULL, null=True, blank=True, related_name='attractions')
    description = models.TextField()
    short_description = models.CharField(max_length=200, help_text="Brief one-liner description")

    # Location details
    address = models.TextField(blank=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)

    # Additional info
    image_url = models.URLField(blank=True)
    website = models.URLField(blank=True)
    entry_fee = models.CharField(max_length=100, blank=True, help_text="e.g., 'Free' or '₹50'")
    timings = models.CharField(max_length=200, blank=True, help_text="e.g., '9 AM - 6 PM'")
    best_time_to_visit = models.CharField(max_length=100, blank=True)

    # Metadata
    is_featured = models.BooleanField(default=False, help_text="Show in featured/popular section")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-is_featured', 'name']

    def __str__(self):
        return self.name


# Helpline Models

class HelplineCategory(models.Model):
    """Categories for helplines (e.g., Hospital, Police, Ambulance)"""
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=50, blank=True, help_text="Icon name or emoji")
    priority = models.IntegerField(default=0, help_text="Higher priority shows first")

    class Meta:
        verbose_name_plural = "Helpline Categories"
        ordering = ['-priority', 'name']

    def __str__(self):
        return self.name


class Helpline(models.Model):
    """Emergency helpline numbers in Chennai"""
    name = models.CharField(max_length=255)
    category = models.ForeignKey(HelplineCategory, on_delete=models.CASCADE, related_name='helplines')
    area = models.ForeignKey(Area, on_delete=models.SET_NULL, null=True, blank=True, related_name='helplines')

    # Contact details
    phone_number = models.CharField(max_length=20)
    alternate_number = models.CharField(max_length=20, blank=True)
    email = models.EmailField(blank=True)

    # Location details
    address = models.TextField(blank=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)

    # Additional info
    description = models.TextField(blank=True, help_text="Additional information about the service")
    timings = models.CharField(max_length=200, blank=True, help_text="e.g., '24/7' or '9 AM - 5 PM'")
    is_emergency = models.BooleanField(default=False, help_text="24/7 emergency service")
    is_toll_free = models.BooleanField(default=False)

    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-is_emergency', 'category__priority', 'name']

    def __str__(self):
        return f"{self.name} - {self.phone_number}"

