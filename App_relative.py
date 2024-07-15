path="pdf/documento_0.pdf"

from kivy.uix.boxlayout import BoxLayout
from kivy.uix.gridlayout import GridLayout
from kivy.uix.button import Button
from kivy.uix.scrollview import ScrollView
from kivy.core.window import Window
from kivy.app import runTouchApp
from kivy.uix.scrollview import ScrollView
from ReadPDF import readPDF

#index_page =id pagina index_p id frase
def merge_wor(index_page,index_p):
    p = ""
    list_of_w = matrix.get(index_page).__getitem__(index_p)#lista parole frase p
    print(list_of_w)
    number_of_element=list_of_w.__len__()
    print(number_of_element)
    for i in range(number_of_element):
       p = p + " " +list_of_w.__getitem__(i)
    return p


matrix = readPDF.get_matrix(path)
print(matrix)
merge_wor(0, 0)
len = matrix.get(0).__len__()
#Testo
layout = GridLayout(cols=1, spacing=10, size_hint_y=None)
layout.bind(minimum_height=layout.setter('height'))
for i in range(len):
    frase = merge_wor(0, i)
    btn = Button(text=str(i)+frase, size_hint_y=None, height=40)
    layout.add_widget(btn)

root = ScrollView(size_hint=(1, None), size=(Window.width, Window.height))
root.add_widget(layout)


runTouchApp(root)