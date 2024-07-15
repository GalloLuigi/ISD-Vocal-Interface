from pdfminer.pdfinterp import PDFResourceManager, PDFPageInterpreter
from pdfminer.converter import PDFPageAggregator
from pdfminer.layout import LAParams, LTTextBox
from pdfminer.pdfpage import PDFPage

class readPDF:
    @staticmethod
    def _split_sentence(sentence):
        processed_sentence = sentence.strip().lower()
        words = processed_sentence.split()
        words = [word for word in words if word]
        return words

    @staticmethod
    def _create_matrix(layout):
        row_words = []
        for lobj in layout:
            if isinstance(lobj, LTTextBox):
                riga = lobj.get_text()
                parole_riga = readPDF._split_sentence(riga)
                row_words.append(parole_riga)
        return row_words

    @staticmethod
    def get_matrix(path):
        try:
            with open(path, 'rb') as fp:
                rsrcmgr = PDFResourceManager()
                laparams = LAParams()
                device = PDFPageAggregator(rsrcmgr, laparams=laparams)
                interpreter = PDFPageInterpreter(rsrcmgr, device)
                pages = PDFPage.get_pages(fp)
                page_struct = {}
                index = 0
                for page in pages:
                    print('Processing next page...')
                    interpreter.process_page(page)
                    layout = device.get_result()
                    page_struct[index] = readPDF._create_matrix(layout)
                    index += 1
            return page_struct
        except FileNotFoundError:
            print(f"Error: File not found at {path}")
            return None
        except Exception as e:
            print(f"Error processing PDF: {e}")
            return None
