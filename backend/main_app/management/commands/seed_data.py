# pyrefly: ignore [missing-import]
from django.core.management.base import BaseCommand
from main_app.models import HealthcareProvider, HealthArticle

class Command(BaseCommand):
    help = 'Seeds sample healthcare providers and health articles'

    def handle(self, *args, **options):
        self.stdout.write('Seeding database...')

        # Seed Providers if not present
        if not HealthcareProvider.objects.exists():
            providers = [
                {
                    "name": "City General Hospital",
                    "provider_type": "hospital",
                    "address": "12 Main St, Sector 4, City Center",
                    "latitude": 23.8103,
                    "longitude": 90.4125,
                    "mobile_no": "+8801711111111",
                    "services": ["Emergency", "ICU", "Cardiology", "Pediatrics", "Surgery"],
                    "rating": 4.6
                },
                {
                    "name": "Arogya Community Clinic",
                    "provider_type": "clinic",
                    "address": "Rural Junction Rd, Ward 2, Village Bazar",
                    "latitude": 23.8223,
                    "longitude": 90.3950,
                    "mobile_no": "+8801722222222",
                    "services": ["General Medicine", "Vaccinations", "Maternal Care", "First Aid"],
                    "rating": 4.2
                },
                {
                    "name": "Lazz Pharma (City Branch)",
                    "provider_type": "pharmacy",
                    "address": "Bazar Road, Near Central Mosque",
                    "latitude": 23.8150,
                    "longitude": 90.4000,
                    "mobile_no": "+8801733333333",
                    "services": ["Prescription Dispensing", "Over-The-Counter Drugs", "Blood Pressure Check"],
                    "rating": 4.8
                },
                {
                    "name": "Metro Diagnostic Center",
                    "provider_type": "diagnostic",
                    "address": "45 Link Road, Sector 11",
                    "latitude": 23.8300,
                    "longitude": 90.4180,
                    "mobile_no": "+8801744444444",
                    "services": ["Blood Tests", "X-Ray", "Ultrasonography", "ECG", "MRI"],
                    "rating": 4.5
                },
                {
                    "name": "Hope Pediatrics Clinic",
                    "provider_type": "clinic",
                    "address": "Greenwood Suburb Area, Lane 4",
                    "latitude": 23.7900,
                    "longitude": 90.4050,
                    "mobile_no": "+8801755555555",
                    "services": ["Pediatrics", "Childhood Immunization", "Neonatal Care"],
                    "rating": 4.7
                }
            ]
            for p in providers:
                HealthcareProvider.objects.create(**p)
            self.stdout.write(self.style.SUCCESS(f'Successfully seeded {len(providers)} healthcare providers.'))
        else:
            self.stdout.write('Healthcare providers already exist.')

        # Seed Health Articles if not present
        if not HealthArticle.objects.exists():
            articles = [
                {
                    "title": "Healthy Nutrition: What a Balanced Plate Looks Like",
                    "category": "Nutrition",
                    "summary": "Learn the fundamentals of a balanced diet, including daily requirements for protein, fiber, carbohydrates, and healthy fats.",
                    "content": "A healthy, balanced diet is key to maintaining good health and a stable weight. According to nutritionists, a balanced plate is split into: half vegetables and fruits, one-quarter whole grains, and one-quarter healthy protein. Vegetables should occupy the largest share, providing essential vitamins, minerals, and dietary fibers. Whole grains, such as brown rice, oats, and whole wheat bread, offer complex carbohydrates that release energy gradually. Proteins can be sourced from lean meats, fish, beans, lentils, and nuts. Lastly, use healthy plant oils (like olive oil) in moderation, and stay well hydrated with water instead of sugary beverages.",
                    "author": "Nutritionist Sarah Jenkins",
                    "read_time": 4
                },
                {
                    "title": "Managing Stress and Mental Wellbeing in Today's Fast World",
                    "category": "Mental Health",
                    "summary": "Practical guidelines and daily exercises to reduce anxiety, improve sleep quality, and foster mental resilience.",
                    "content": "In our fast-paced daily life, stress is common but can be managed. Chronic stress affects both mental and physical health, leading to high blood pressure, weakened immunity, and anxiety. To cultivate mental wellness: 1. Practice mindfulness or meditation for 10 minutes daily. Focus on your breathing to calm the nervous system. 2. Build strong social support. Talking to friends or family releases emotional tension. 3. Ensure regular exercise. Physical movement releases endorphins, the natural mood boosters. 4. Maintain a regular sleeping schedule. Restorative sleep is when the brain processes stress. If feelings of overwhelm persist, do not hesitate to consult a professional psychologist.",
                    "author": "Dr. Alan Carter (Psychiatrist)",
                    "read_time": 5
                },
                {
                    "title": "Preventing and Managing the Common Cold & Flu",
                    "category": "Preventive Care",
                    "summary": "An easy-to-follow guide on hygiene practices, symptom recognition, and home remedies for recovery.",
                    "content": "The common cold and influenza are respiratory infections caused by viruses. Prevention is the best defense. Wash your hands frequently with soap and water for at least 20 seconds. Avoid close contact with anyone who is coughing or sneezing. If you catch a cold, the primary treatment involves getting plenty of bed rest, drinking hot fluids (like herbal tea or chicken broth) to soothe your throat, and using saline nasal drops to ease congestion. Over-the-counter pain relievers can help with muscle aches and fever. Seek professional medical evaluation if you experience high fever that doesn't drop, severe chest pain, or difficulty breathing.",
                    "author": "Dr. Mukul Kumar",
                    "read_time": 3
                },
                {
                    "title": "Maternal Care: Guide to a Healthy Pregnancy",
                    "category": "Maternal Care",
                    "summary": "Essential tips for expectant mothers, covering prenatal visits, diet, exercises, and danger symptoms to watch for.",
                    "content": "Pregnancy is a beautiful journey that requires mindful care. Expectant mothers should seek regular prenatal visits starting in the first trimester. A rich diet containing folic acid, iron, calcium, and vitamin D is essential for the baby's bone and brain development. Light exercises, such as walking or prenatal yoga, improve circulation and stamina. Pregnant women should strictly avoid smoking, alcohol, and self-medication. Keep an eye out for danger signs: sudden swelling of hands or face, severe headaches, blurry vision, high fever, or vaginal bleeding. If any of these arise, seek emergency medical care immediately.",
                    "author": "Dr. Deepika (OB-GYN)",
                    "read_time": 6
                }
            ]
            for a in articles:
                HealthArticle.objects.create(**a)
            self.stdout.write(self.style.SUCCESS(f'Successfully seeded {len(articles)} health library articles.'))
        else:
            self.stdout.write('Health library articles already exist.')
