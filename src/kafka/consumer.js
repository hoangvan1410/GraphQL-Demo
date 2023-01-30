const { Kafka } = require("kafkajs")

// the client ID lets kafka know who's producing the messages
const clientId = "ContractService-0824b745-6457-4eac-8212-5dd0743e23c4-StreamThread-1-consumer"
// we can define the list of brokers in the cluster
const brokers = ["172.20.4.201:9092"]
// this is the topic to which we want to write messages
const topic = "person"

// initialize a new kafka client and initialize a producer from it
const kafka = new Kafka({ clientId, brokers })
const consumer = kafka.consumer({ groupId: clientId })

const Person = ({
    id: String,
    name: String
})
const consume = async () => {
	// first, we wait for the client to connect and subscribe to the given topic
	await consumer.connect()
	await consumer.subscribe({ topic })
	await consumer.run({
		// this function is called every time the consumer gets a new message
		eachMessage: ({ message }) => {
			console.log(`received message: ${message}`)
            const myArray = message.value.split(" ");
			// here, we just log the message to the standard output
			console.log(`received message: ${message.value}`)
            console.log(`received message: ${myArray}`)
		},
	})
}

module.exports = consume