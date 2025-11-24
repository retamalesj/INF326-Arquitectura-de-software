import { Sidebar } from '@/components/ui/sidebar'
import { useState } from 'react'
import { CalculatorChatbot } from './chatbots/CalculatorChatbot'
import { WikipediaChatbot } from './chatbots/WikipediaChatbot'
import { ProgrammingChatbot } from './chatbots/ProgrammingChatbot'

const chatbots = [
  { name: 'Calculadora', component: <CalculatorChatbot /> },
  { name: 'Wikipedia', component: <WikipediaChatbot /> },
  { name: 'Programación', component: <ProgrammingChatbot /> },
]

export const Chatbots = () => {
  const [selectedChatbot, setSelectedChatbot] = useState<string>(
    chatbots[0].name,
  )

  // renderiza el chatbot correcto
  const renderChatbot = () => {
    const bot = chatbots.find((c) => c.name === selectedChatbot)
    return bot ? bot.component : <div>Selecciona un chatbot</div>
  }

  return (
    <div className="flex w-full h-full">
      {/* Sidebar de Chatbots */}
      <Sidebar title="Chatbots">
        <div className="flex flex-col gap-2">
          {chatbots.map((bot) => (
            <button
              key={bot.name}
              className={`p-2 rounded ${
                selectedChatbot === bot.name
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200'
              }`}
              onClick={() => setSelectedChatbot(bot.name)}
            >
              {bot.name}
            </button>
          ))}
        </div>
      </Sidebar>

      {/* Contenido principal */}
      <div className="flex-1 h-full p-4 flex flex-col">{renderChatbot()}</div>
    </div>
  )
}
