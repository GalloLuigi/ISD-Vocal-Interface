<path = "prova.pdf"


from PyPDF2 import PdfFileWriter, PdfFileReader, PdfReader, PdfWriter
import io
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from pdfminer.layout import LAParams, LTTextBox
from pdfminer.pdfpage import PDFPage
from pdfminer.pdfinterp import PDFResourceManager
from pdfminer.pdfinterp import PDFPageInterpreter
from pdfminer.converter import PDFPageAggregator

def main():
    fp = open(path, 'rb')
    rsrcmgr = PDFResourceManager()
    laparams = LAParams()
    device = PDFPageAggregator(rsrcmgr, laparams=laparams)
    interpreter = PDFPageInterpreter(rsrcmgr, device)
    pages = PDFPage.get_pages(fp)
    count = 0

    for page in pages:
        print('Processing next page...')
        interpreter.process_page(page)
        layout = device.get_result()

        for lobj in layout:
            count = count + 1

            if isinstance(lobj, LTTextBox):
                x, y, text = lobj.bbox[0], lobj.bbox[3], lobj.get_text()
                drowIndex(x-10, y-13 , str(count))
                print('At %r is text: %s' % ((x, y), text))
                print("Count is "+str(count))


def drowIndex(x,y,incremental_index):
    print("Enter in drowIndex")
    packet = io.BytesIO()
    can = canvas.Canvas(packet, pagesize=letter)
    can.setFillColorRGB(1, 0, 0)
    can.setFont("Times-Roman", 10)
    can.drawRightString(x, y, incremental_index)
    can.save()

    packet.seek(0)
    new_pdf = PdfReader(packet)

    existing_pdf = PdfReader(open("prova.pdf", "rb"))
    output = PdfWriter()

    page = existing_pdf.pages[0]
    page.merge_page(new_pdf.pages[0])
    output.add_page(page)

    outputStream = open("prova.pdf", "wb")
    output.write(outputStream)
    outputStream.close()


if __name__=='__main__':
    main()
