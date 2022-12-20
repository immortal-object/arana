import pika
import datetime

connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
channel = connection.channel()

channel.queue_declare(queue='earth', durable=True, auto_delete=False, arguments=None, )
dt_now = datetime.datetime.utcnow()
message = str('Текущее UTC время:  ' + dt_now.strftime('%H:%M:%S'))

channel.basic_publish(exchange='',
                    routing_key='earth',
                    body= message )
print("Сообщение отправлено подписчикам earth")

channel.queue_declare(queue='moon', durable=True, auto_delete=False, arguments=None)
message = ('За последний час Луна продвинулась по орбите на ~3682,8км.')

channel.basic_publish(exchange='',
                    routing_key='moon',
                    body= message )
print("Сообщение отправлено подписчикам moon")

channel.queue_declare(queue='mercury', durable=True, auto_delete=False, arguments=None)
message = ('За последний час Меркурий продвинулся по орбите на ~170640км.')

channel.basic_publish(exchange='',
                    routing_key='mercury',
                    body= message )
print("Сообщение отправлено подписчикам mercury")

connection.close()