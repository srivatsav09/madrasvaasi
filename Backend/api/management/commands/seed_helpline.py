from django.core.management.base import BaseCommand
from api.models import HelplineCategory, Helpline, Area


class Command(BaseCommand):
    help = 'Seed database with Chennai helpline data'

    def handle(self, *args, **kwargs):
        self.stdout.write('Seeding helpline data...')

        # Create Categories
        categories_data = [
            {'name': 'Emergency Services', 'icon': '🚨', 'description': 'Police, Fire, Ambulance', 'priority': 100},
            {'name': 'Hospitals', 'icon': '🏥', 'description': 'Hospitals and medical centers', 'priority': 90},
            {'name': 'Police Stations', 'icon': '👮', 'description': 'Local police stations', 'priority': 80},
            {'name': 'Ambulance Services', 'icon': '🚑', 'description': 'Emergency ambulance services', 'priority': 85},
            {'name': 'Fire Services', 'icon': '🚒', 'description': 'Fire and rescue', 'priority': 85},
            {'name': 'Women Helpline', 'icon': '👩', 'description': 'Women safety and support', 'priority': 75},
            {'name': 'Child Helpline', 'icon': '👶', 'description': 'Child welfare services', 'priority': 70},
            {'name': 'Blood Banks', 'icon': '🩸', 'description': 'Blood donation centers', 'priority': 65},
        ]

        categories = {}
        for cat_data in categories_data:
            category, created = HelplineCategory.objects.get_or_create(
                name=cat_data['name'],
                defaults={
                    'icon': cat_data['icon'],
                    'description': cat_data['description'],
                    'priority': cat_data['priority']
                }
            )
            categories[cat_data['name']] = category
            if created:
                self.stdout.write(f'  Created category: {cat_data["name"]}')

        # Get areas (from tourism seed)
        areas = {area.name: area for area in Area.objects.all()}

        # Create Helplines
        helplines_data = [
            # Emergency Services
            {
                'name': 'Emergency (Police, Fire, Ambulance)',
                'category': 'Emergency Services',
                'area': None,
                'phone_number': '112',
                'description': 'Single emergency number for police, fire, and ambulance services in India',
                'timings': '24/7',
                'is_emergency': True,
                'is_toll_free': True,
            },
            {
                'name': 'Police Emergency',
                'category': 'Emergency Services',
                'area': None,
                'phone_number': '100',
                'description': 'Police emergency helpline',
                'timings': '24/7',
                'is_emergency': True,
                'is_toll_free': True,
            },
            {
                'name': 'Fire Emergency',
                'category': 'Emergency Services',
                'area': None,
                'phone_number': '101',
                'description': 'Fire and rescue emergency services',
                'timings': '24/7',
                'is_emergency': True,
                'is_toll_free': True,
            },
            {
                'name': 'Ambulance Emergency',
                'category': 'Emergency Services',
                'area': None,
                'phone_number': '108',
                'description': 'Emergency ambulance services',
                'timings': '24/7',
                'is_emergency': True,
                'is_toll_free': True,
            },

            # Hospitals - Mylapore
            {
                'name': 'Apollo Hospital',
                'category': 'Hospitals',
                'area': 'Mylapore',
                'phone_number': '044-28296000',
                'alternate_number': '044-28296161',
                'address': 'Greams Road, Chennai',
                'latitude': 13.0569,
                'longitude': 80.2425,
                'description': 'Multi-specialty hospital with 24/7 emergency services',
                'timings': '24/7',
                'is_emergency': True,
            },
            {
                'name': 'Sri Ramachandra Medical Centre',
                'category': 'Hospitals',
                'area': 'Mylapore',
                'phone_number': '044-45928477',
                'address': 'Porur, Chennai',
                'latitude': 13.0358,
                'longitude': 80.1503,
                'description': 'Teaching hospital with advanced medical facilities',
                'timings': '24/7',
                'is_emergency': True,
            },

            # Hospitals - Adyar
            {
                'name': 'MIOT International',
                'category': 'Hospitals',
                'area': 'Adyar',
                'phone_number': '044-42002000',
                'address': '4/112, Mount Poonamallee Road, Manapakkam',
                'latitude': 13.0358,
                'longitude': 80.1571,
                'description': 'Multi-organ transplant hospital',
                'timings': '24/7',
                'is_emergency': True,
            },
            {
                'name': 'Adyar Cancer Institute',
                'category': 'Hospitals',
                'area': 'Adyar',
                'phone_number': '044-24910941',
                'address': '336, Sardar Patel Rd, Adyar',
                'latitude': 13.0087,
                'longitude': 80.2566,
                'description': 'Specialized cancer treatment center',
                'timings': '8:00 AM - 6:00 PM',
                'is_emergency': False,
            },

            # Hospitals - Egmore
            {
                'name': 'Government General Hospital',
                'category': 'Hospitals',
                'area': 'Egmore',
                'phone_number': '044-25305000',
                'address': 'EVR Periyar Salai, Park Town',
                'latitude': 13.0846,
                'longitude': 80.2740,
                'description': 'Government hospital with emergency services',
                'timings': '24/7',
                'is_emergency': True,
            },

            # Hospitals - T. Nagar
            {
                'name': 'Fortis Malar Hospital',
                'category': 'Hospitals',
                'area': 'T. Nagar',
                'phone_number': '044-42892222',
                'address': '52, 1st Main Rd, Gandhi Nagar, Adyar',
                'latitude': 13.0058,
                'longitude': 80.2577,
                'description': 'Multi-specialty hospital',
                'timings': '24/7',
                'is_emergency': True,
            },

            # Police Stations
            {
                'name': 'Mylapore Police Station',
                'category': 'Police Stations',
                'area': 'Mylapore',
                'phone_number': '044-24981222',
                'address': 'Luz Church Road, Mylapore',
                'latitude': 13.0339,
                'longitude': 80.2682,
                'timings': '24/7',
                'is_emergency': True,
            },
            {
                'name': 'Adyar Police Station',
                'category': 'Police Stations',
                'area': 'Adyar',
                'phone_number': '044-24914000',
                'address': 'Lattice Bridge Road, Adyar',
                'latitude': 13.0011,
                'longitude': 80.2572,
                'timings': '24/7',
                'is_emergency': True,
            },
            {
                'name': 'Egmore Police Station',
                'category': 'Police Stations',
                'area': 'Egmore',
                'phone_number': '044-28193100',
                'address': 'Gandhi Irwin Road, Egmore',
                'latitude': 13.0732,
                'longitude': 80.2609,
                'timings': '24/7',
                'is_emergency': True,
            },
            {
                'name': 'T. Nagar Police Station',
                'category': 'Police Stations',
                'area': 'T. Nagar',
                'phone_number': '044-24340579',
                'address': 'Venkatanarayana Road, T. Nagar',
                'latitude': 13.0418,
                'longitude': 80.2341,
                'timings': '24/7',
                'is_emergency': True,
            },

            # Ambulance Services
            {
                'name': 'GVK EMRI Ambulance',
                'category': 'Ambulance Services',
                'area': None,
                'phone_number': '108',
                'description': 'Free emergency ambulance service',
                'timings': '24/7',
                'is_emergency': True,
                'is_toll_free': True,
            },
            {
                'name': 'Ziqitza Health Care (ZHL) Ambulance',
                'category': 'Ambulance Services',
                'area': None,
                'phone_number': '1298',
                'description': 'Private ambulance service',
                'timings': '24/7',
                'is_emergency': True,
            },

            # Fire Services
            {
                'name': 'Chennai Fire Service',
                'category': 'Fire Services',
                'area': None,
                'phone_number': '101',
                'description': 'Fire and rescue services',
                'timings': '24/7',
                'is_emergency': True,
                'is_toll_free': True,
            },

            # Women Helpline
            {
                'name': 'Women Helpline',
                'category': 'Women Helpline',
                'area': None,
                'phone_number': '181',
                'description': '24x7 helpline for women in distress',
                'timings': '24/7',
                'is_emergency': True,
                'is_toll_free': True,
            },
            {
                'name': 'Domestic Violence Helpline',
                'category': 'Women Helpline',
                'area': None,
                'phone_number': '1091',
                'description': 'Helpline for domestic violence victims',
                'timings': '24/7',
                'is_emergency': True,
                'is_toll_free': True,
            },

            # Child Helpline
            {
                'name': 'Childline India',
                'category': 'Child Helpline',
                'area': None,
                'phone_number': '1098',
                'description': 'Emergency helpline for children in need',
                'timings': '24/7',
                'is_emergency': True,
                'is_toll_free': True,
            },

            # Blood Banks
            {
                'name': 'Indian Red Cross Blood Bank',
                'category': 'Blood Banks',
                'area': 'Egmore',
                'phone_number': '044-25353891',
                'address': 'Red Cross Building, Egmore',
                'description': 'Blood donation and storage facility',
                'timings': '8:00 AM - 5:00 PM',
                'is_emergency': False,
            },
            {
                'name': 'Rotary Blood Bank',
                'category': 'Blood Banks',
                'area': 'T. Nagar',
                'phone_number': '044-24340571',
                'address': 'Habibullah Road, T. Nagar',
                'description': 'Blood bank operated by Rotary International',
                'timings': '9:00 AM - 5:00 PM',
                'is_emergency': False,
            },
        ]

        helplines_created = 0
        for helpline_data in helplines_data:
            category = categories[helpline_data.pop('category')]
            area_name = helpline_data.pop('area')
            area = areas.get(area_name) if area_name else None

            helpline, created = Helpline.objects.get_or_create(
                name=helpline_data['name'],
                phone_number=helpline_data['phone_number'],
                defaults={
                    **helpline_data,
                    'category': category,
                    'area': area,
                }
            )
            if created:
                helplines_created += 1
                self.stdout.write(f'  Created helpline: {helpline.name}')

        self.stdout.write(self.style.SUCCESS(
            f'\nSuccessfully seeded helpline data!'
            f'\n  Categories: {len(categories)}'
            f'\n  Helplines: {helplines_created} new'
        ))
