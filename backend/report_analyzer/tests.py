from django.test import TestCase, Client
from django.core.files.uploadedfile import SimpleUploadedFile

class AnalyzerViewTests(TestCase):
    def setUp(self):
        self.client = Client()

    def test_index_get(self):
        """GET request to root should return status 200."""
        response = self.client.get('/')
        self.assertEqual(response.status_code, 200)

    def test_index_post_invalid_file(self):
        """POST request with invalid file format should return an error."""
        invalid_file = SimpleUploadedFile("report.pdf", b"Some medical report data", content_type="application/pdf")
        response = self.client.post('/', {'report': invalid_file})
        self.assertEqual(response.status_code, 200)
        self.assertIn("Please upload a valid .txt file.", response.content.decode('utf-8'))
