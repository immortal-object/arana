import time
from threading import Thread
import pika, sys, os
import mysql.connector
import requests

def startPlanet(planet):
    TOKEN="5989764052:AAHFtzLmqFELQFys_VXr72oTzFjMPT8maPw"
    connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
    channel = connection.channel()
    channel.queue_declare(queue=planet, durable=True, auto_delete=False, arguments=None)

    def callback(ch, method, properties, body):
        print(" [x] Поступило сообщение: %r" % str(body, "utf-8"))
        myconn = mysql.connector.connect(user='root', password='sdghsdkg3762A',
                                  host='127.0.0.1',
                                  database='arana',
                                  use_pure=False)
        cur = myconn.cursor()
        cur.execute("SELECT user_id FROM arana.pool LEFT JOIN arana.users ON users.id=pool.id WHERE project = '"+planet+"'") 
        myresult = cur.fetchall()
        for chatid in myresult:
            params = {
            'chat_id': chatid[0],
            'text': body,
                     }
            response = requests.post('https://api.telegram.org/bot'+TOKEN+'/sendMessage', params=params)
        myconn.close()

    channel.basic_consume(queue=planet,
                          auto_ack=True,
                          on_message_callback=callback)
                        
    channel.start_consuming()
    connection.close()

if __name__ == '__main__':
    planets = ["earth", "moon", "mercury"]
    print(' [*] Ожидание сообщений... Для выхода из приложения нажмите - CTRL+C')
    try:
        for planet in planets:
            th = Thread(target=startPlanet, args=(planet, ))
            th.daemon = True
            th.start()
        while True:
            time.sleep(2)
    except KeyboardInterrupt:
        print('Работа завершена')
        try:
            sys.exit(0)
        except SystemExit:
            os._exit(0)