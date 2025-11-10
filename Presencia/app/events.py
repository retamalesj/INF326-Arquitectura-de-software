import json
import aio_pika
import logging

logging.getLogger("aio_pika").setLevel(logging.ERROR)

class Emit:
  def __init__(self, url='amqp://guest:guest@message-broker/'):
    self.url = url
    self.connection = None
    self.channel = None

  async def send(self, id, action, payload):
    await self.connect()
    await self.publish(id, action, payload)
    await self.close()

  async def connect(self):
    self.connection = await aio_pika.connect_robust(self.url)
    self.channel = await self.connection.channel()
    self.exchange = await self.channel.declare_exchange('presence',
                                        aio_pika.ExchangeType.TOPIC)
  
    self.queue = await self.channel.declare_queue(
        'presence_queue',
        durable=True
    )

    await self.queue.bind(self.exchange, routing_key="user.#")

  async def publish(self, id, action, payload):
    routing_key = f"user.{action}.{id}"
    message_body = json.dumps(payload).encode('utf-8')

    message = aio_pika.Message(
      body=message_body,
      content_type='application/json'
    )

    await self.exchange.publish(message, routing_key)
    
    print(f"[EVENT] exchange 'presence' {action} publicado en RabbitMQ -> {payload}")

  async def close(self):
    if self.connection:
      await self.connection.close()
      self.connection = None
      self.channel = None