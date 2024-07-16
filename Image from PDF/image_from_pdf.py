import io

DIR_INPUT = "img/"
DIR_OUTPUT = "img/"
import aspose.pdf as ap

input_file = DIR_INPUT + "sample_with_image.pdf"
output_image = DIR_OUTPUT + "extract_image.jpg"
# Open document
document = ap.Document(input_file)

# Extract a particular image
xImage = document.pages[1].resources.images[1]
outputImage = io.FileIO(output_image, "w")

# Save output image
xImage.save(outputImage)
outputImage.close()
# Save updated PDF file
document.save(DIR_OUTPUT + "output.pdf")