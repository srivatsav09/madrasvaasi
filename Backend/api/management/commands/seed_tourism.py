from django.core.management.base import BaseCommand
from api.models import TourismCategory, Area, Attraction


class Command(BaseCommand):
    help = 'Seed database with Chennai tourism data'

    def handle(self, *args, **kwargs):
        self.stdout.write('Seeding tourism data...')

        # Create Categories
        categories_data = [
            {'name': 'Temple', 'icon': '🛕', 'description': 'Hindu temples and places of worship'},
            {'name': 'Beach', 'icon': '🏖️', 'description': 'Beaches and coastal attractions'},
            {'name': 'Museum', 'icon': '🏛️', 'description': 'Museums and art galleries'},
            {'name': 'Church', 'icon': '⛪', 'description': 'Churches and Christian heritage'},
            {'name': 'Historical Monument', 'icon': '🏰', 'description': 'Forts, palaces, and historical sites'},
            {'name': 'Park & Recreation', 'icon': '🌳', 'description': 'Parks, gardens, and recreation areas'},
            {'name': 'Shopping', 'icon': '🛍️', 'description': 'Markets and shopping destinations'},
            {'name': 'Wildlife', 'icon': '🦎', 'description': 'Zoos and wildlife sanctuaries'},
        ]

        categories = {}
        for cat_data in categories_data:
            category, created = TourismCategory.objects.get_or_create(
                name=cat_data['name'],
                defaults={'icon': cat_data['icon'], 'description': cat_data['description']}
            )
            categories[cat_data['name']] = category
            if created:
                self.stdout.write(f'  Created category: {cat_data["name"]}')

        # Create Areas
        areas_data = [
            {'name': 'Mylapore', 'description': 'Cultural hub with temples and traditional markets'},
            {'name': 'George Town', 'description': 'Historic commercial district'},
            {'name': 'Marina Beach', 'description': 'Coastal area with beaches'},
            {'name': 'Egmore', 'description': 'Central area with museums and government buildings'},
            {'name': 'T. Nagar', 'description': 'Major shopping district'},
            {'name': 'Guindy', 'description': 'Green belt area with parks'},
            {'name': 'Santhome', 'description': 'Coastal area with religious significance'},
            {'name': 'Triplicane', 'description': 'Historic neighborhood'},
            {'name': 'Adyar', 'description': 'Residential and cultural area'},
            {'name': 'Vandalur', 'description': 'Suburban area'},
        ]

        areas = {}
        for area_data in areas_data:
            area, created = Area.objects.get_or_create(
                name=area_data['name'],
                defaults={'description': area_data['description']}
            )
            areas[area_data['name']] = area
            if created:
                self.stdout.write(f'  Created area: {area_data["name"]}')

        # Create Attractions
        attractions_data = [
            {
                'name': 'Kapaleeshwarar Temple',
                'category': 'Temple',
                'area': 'Mylapore',
                'short_description': 'Ancient Shiva temple with stunning Dravidian architecture',
                'description': 'A magnificent 7th-century temple dedicated to Lord Shiva, featuring intricate gopurams and sculptures. One of Chennai\'s most iconic landmarks showcasing traditional South Indian temple architecture.',
                'address': 'Kapaleeswarar Sannidhi St, Mylapore',
                'latitude': 13.0339,
                'longitude': 80.2682,
                'image_url': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Kapaleeshwarar_Temple_01.jpg/1200px-Kapaleeshwarar_Temple_01.jpg',
                'entry_fee': 'Free',
                'timings': '6:00 AM - 12:30 PM, 4:00 PM - 9:00 PM',
                'best_time_to_visit': 'Morning or evening',
                'is_featured': True,
            },
            {
                'name': 'Marina Beach',
                'category': 'Beach',
                'area': 'Marina Beach',
                'short_description': 'World\'s second-longest urban beach',
                'description': 'Stretching 13 km along the Bay of Bengal, Marina Beach is a popular spot for morning walks, food stalls, and enjoying the sea breeze. Watch stunning sunrises and sunsets while enjoying local street food.',
                'address': 'Marina Beach, Chennai',
                'latitude': 13.0499,
                'longitude': 80.2824,
                'image_url': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Marina_Beach%2C_Chennai.jpg/1200px-Marina_Beach%2C_Chennai.jpg',
                'entry_fee': 'Free',
                'timings': 'Open 24 hours (best before 10 AM or after 4 PM)',
                'best_time_to_visit': 'Early morning or evening',
                'is_featured': True,
            },
            {
                'name': 'Fort St. George',
                'category': 'Historical Monument',
                'area': 'George Town',
                'short_description': 'First British fortress in India, built in 1644',
                'description': 'The first English fortress in India, now housing the Tamil Nadu Legislative Assembly and Secretariat. Features a museum with colonial-era artifacts, weapons, and uniforms.',
                'address': 'Fort St George, George Town',
                'latitude': 13.0795,
                'longitude': 80.2884,
                'image_url': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Fort_St_George_Museum.jpg/1200px-Fort_St_George_Museum.jpg',
                'entry_fee': '₹15 (Indians), ₹200 (Foreigners)',
                'timings': '9:00 AM - 5:00 PM (Closed Fridays)',
                'best_time_to_visit': 'Weekday mornings',
                'is_featured': True,
            },
            {
                'name': 'Government Museum',
                'category': 'Museum',
                'area': 'Egmore',
                'short_description': 'Second oldest museum in India with rich collections',
                'description': 'Established in 1851, this museum houses an impressive collection of archaeology, numismatics, zoology, and art galleries. The bronze gallery is particularly renowned.',
                'address': 'Pantheon Rd, Egmore',
                'latitude': 13.0660,
                'longitude': 80.2594,
                'image_url': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Government_Museum%2C_Chennai_01.jpg/1200px-Government_Museum%2C_Chennai_01.jpg',
                'entry_fee': '₹15 (Indians), ₹250 (Foreigners)',
                'timings': '9:30 AM - 5:00 PM (Closed Fridays)',
                'best_time_to_visit': 'Morning hours',
                'is_featured': True,
            },
            {
                'name': 'San Thome Basilica',
                'category': 'Church',
                'area': 'Santhome',
                'short_description': 'Catholic church built over the tomb of St. Thomas',
                'description': 'A beautiful neo-Gothic cathedral built by Portuguese explorers in the 16th century. It houses the tomb of St. Thomas, one of the twelve apostles of Jesus Christ.',
                'address': 'Santhome High Rd, Mylapore',
                'latitude': 13.0330,
                'longitude': 80.2773,
                'image_url': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/San_Thome_Basilica_Chennai.jpg/1200px-San_Thome_Basilica_Chennai.jpg',
                'entry_fee': 'Free',
                'timings': '6:00 AM - 8:00 PM',
                'best_time_to_visit': 'Anytime',
                'is_featured': True,
            },
            {
                'name': 'Guindy National Park',
                'category': 'Wildlife',
                'area': 'Guindy',
                'short_description': 'One of the smallest national parks in India',
                'description': 'A protected area right in the heart of the city, home to blackbucks, spotted deer, jackals, and various bird species. Perfect for nature lovers and families.',
                'address': 'Guindy, Chennai',
                'latitude': 13.0067,
                'longitude': 80.2354,
                'image_url': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Guindy_National_Park.jpg/1200px-Guindy_National_Park.jpg',
                'entry_fee': '₹15 (Adults), ₹10 (Children)',
                'timings': '9:00 AM - 5:30 PM',
                'best_time_to_visit': 'Winter months (Nov-Feb)',
                'is_featured': False,
            },
            {
                'name': 'Arignar Anna Zoological Park (Vandalur Zoo)',
                'category': 'Wildlife',
                'area': 'Vandalur',
                'short_description': 'One of the largest zoos in South Asia',
                'description': 'Sprawling across 1,265 acres, this zoo is home to over 2,500 species of flora and fauna. Features a safari park, butterfly house, and nocturnal animal house.',
                'address': 'Vandalur, Chennai',
                'latitude': 12.8792,
                'longitude': 80.0822,
                'image_url': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Vandalur_Zoo.jpg/1200px-Vandalur_Zoo.jpg',
                'entry_fee': '₹50 (Adults), ₹25 (Children)',
                'timings': '9:00 AM - 5:00 PM (Closed Tuesdays)',
                'best_time_to_visit': 'Morning hours',
                'is_featured': True,
            },
            {
                'name': 'Parthasarathy Temple',
                'category': 'Temple',
                'area': 'Triplicane',
                'short_description': '8th-century temple dedicated to Lord Krishna',
                'description': 'One of the oldest temples in Chennai, built by the Pallavas in the 8th century. Known for its unique idol of Krishna as Parthasarathy (charioteer of Arjuna).',
                'address': 'Triplicane High Rd, Triplicane',
                'latitude': 13.0634,
                'longitude': 80.2772,
                'image_url': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Parthasarathy_Temple_Triplicane.jpg/1200px-Parthasarathy_Temple_Triplicane.jpg',
                'entry_fee': 'Free',
                'timings': '6:00 AM - 12:00 PM, 4:00 PM - 9:00 PM',
                'best_time_to_visit': 'Morning',
                'is_featured': False,
            },
            {
                'name': 'Elliot\'s Beach (Besant Nagar Beach)',
                'category': 'Beach',
                'area': 'Adyar',
                'short_description': 'Clean and calm beach popular among locals',
                'description': 'A quieter alternative to Marina Beach, Elliot\'s Beach is cleaner and less crowded. Great for spending evenings with family and enjoying seafood at nearby restaurants.',
                'address': 'Besant Nagar, Chennai',
                'latitude': 13.0031,
                'longitude': 80.2669,
                'image_url': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Elliots_Beach.jpg/1200px-Elliots_Beach.jpg',
                'entry_fee': 'Free',
                'timings': 'Open 24 hours',
                'best_time_to_visit': 'Evening',
                'is_featured': False,
            },
            {
                'name': 'T. Nagar Shopping District',
                'category': 'Shopping',
                'area': 'T. Nagar',
                'short_description': 'Premier shopping destination in Chennai',
                'description': 'One of India\'s busiest shopping areas, famous for jewelry, silk sarees, and traditional wear. Ranganathan Street and Usman Road are particularly popular.',
                'address': 'T. Nagar, Chennai',
                'latitude': 13.0419,
                'longitude': 80.2341,
                'entry_fee': 'Free',
                'timings': '10:00 AM - 9:00 PM (varies by shop)',
                'best_time_to_visit': 'Weekday mornings to avoid crowds',
                'is_featured': False,
            },
            {
                'name': 'Theosophical Society',
                'category': 'Park & Recreation',
                'area': 'Adyar',
                'short_description': 'Serene 260-acre campus with diverse trees',
                'description': 'A peaceful retreat featuring lush gardens, a library, and the famous 450-year-old banyan tree. Perfect for nature walks and meditation.',
                'address': 'Besant Gardens, Adyar',
                'latitude': 13.0049,
                'longitude': 80.2542,
                'image_url': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Theosophical_Society_Adyar.jpg/1200px-Theosophical_Society_Adyar.jpg',
                'entry_fee': 'Free',
                'timings': '8:30 AM - 10:00 AM, 2:00 PM - 4:00 PM',
                'best_time_to_visit': 'Morning',
                'is_featured': False,
            },
            {
                'name': 'Vadapalani Murugan Temple',
                'category': 'Temple',
                'area': 'Triplicane',
                'short_description': 'Famous temple dedicated to Lord Murugan',
                'description': 'A relatively modern temple (built in 1890s) that has become one of the most visited temples in Chennai. Known for its beautiful architecture and spiritual atmosphere.',
                'address': 'Vadapalani',
                'latitude': 13.0508,
                'longitude': 80.2125,
                'entry_fee': 'Free',
                'timings': '5:30 AM - 12:00 PM, 4:00 PM - 9:30 PM',
                'best_time_to_visit': 'Early morning or evening',
                'is_featured': False,
            },
        ]

        attractions_created = 0
        for attr_data in attractions_data:
            category = categories[attr_data.pop('category')]
            area = areas[attr_data.pop('area')]

            attraction, created = Attraction.objects.get_or_create(
                name=attr_data['name'],
                defaults={
                    **attr_data,
                    'category': category,
                    'area': area,
                }
            )
            if created:
                attractions_created += 1
                self.stdout.write(f'  Created attraction: {attraction.name}')

        self.stdout.write(self.style.SUCCESS(
            f'\nSuccessfully seeded tourism data!'
            f'\n  Categories: {len(categories)}'
            f'\n  Areas: {len(areas)}'
            f'\n  Attractions: {attractions_created} new'
        ))
