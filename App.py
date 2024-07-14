import kivy
from kivy.app import App
from kivy.uix.gridlayout import GridLayout
from kivy.uix.label import Label
from kivy.uix.button import Button
from kivy.uix.boxlayout import BoxLayout
from kivy.uix.scrollview import ScrollView
from kivy.core.window import Window


class ExampleApp(App):

    def build(self):
        # Create the main BoxLayout
        main_layout = BoxLayout(orientation='horizontal', padding=20)


        #Preparo il main_text layout
        #main_text = BoxLayout(orientation='vertical', padding=20)
        main_text= GridLayout(cols=1, spacing=10, size_hint_y=None)
        #scroll_view = ScrollView(do_scroll_x=False, do_scroll_y=True)

        # Set main text
        label_1 = Label(text="Kivy BoxLayout Example", font_size=32)
        label_2 = Label(text="Kivy BoxLayout Example", font_size=32)
        label_3 = Label(text="Kivy BoxLayout Example", font_size=32)
        label_11 = Label(text="Kivy BoxLayout Example", font_size=32)
        label_21 = Label(text="Kivy BoxLayout Example", font_size=32)
        label_31 = Label(text="Kivy BoxLayout Example", font_size=32)
        label_12 = Label(text="Kivy BoxLayout Example", font_size=32)
        label_22 = Label(text="Kivy BoxLayout Example", font_size=32)
        label_32 = Label(text="Kivy BoxLayout Example", font_size=32)
        label_13 = Label(text="Kivy BoxLayout Example", font_size=32)
        label_23 = Label(text="Kivy BoxLayout Example", font_size=32)
        label_33 = Label(text="Kivy BoxLayout Example", font_size=32)

        main_text.add_widget(label_1)
        main_text.add_widget(label_2)
        main_text.add_widget(label_3)
        main_text.add_widget(label_11)
        main_text.add_widget(label_21)
        main_text.add_widget(label_31)
        main_text.add_widget(label_12)
        main_text.add_widget(label_22)
        main_text.add_widget(label_32)
        main_text.add_widget(label_13)
        main_text.add_widget(label_23)
        main_text.add_widget(label_33)

        #Preparo main_note
        main_note = BoxLayout(orientation='vertical', padding=20)


        #Setting main_layout
        root = ScrollView()
        root.add_widget(main_text)
        main_layout.add_widget(root)
        main_layout.add_widget(main_note)



        return main_layout

if __name__ == "__main__":
    ExampleApp().run()