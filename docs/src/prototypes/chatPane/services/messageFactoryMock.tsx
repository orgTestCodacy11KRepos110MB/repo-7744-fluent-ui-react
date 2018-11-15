import * as _ from 'lodash'
import { DividerProps } from 'src/components/Divider/Divider'
import { ChatData, areSameDay, getFriendlyDateString } from '.'
import { generateChatMsgProps, ChatMessage } from './generateChatMsgProps'

export enum ChatItemTypes {
  message,
  divider,
}

interface ChatItem {
  itemType: ChatItemTypes
}

interface Divider extends DividerProps, ChatItem {}

type ChatItemContentProps = ChatMessage | Divider

function generateDividerProps(props: DividerProps): Divider {
  const { content, important, type = 'secondary' } = props
  const dividerProps: Divider = { itemType: ChatItemTypes.divider, content, important, type }

  return dividerProps
}

export function generateChatProps(chat: ChatData): ChatItemContentProps[] {
  if (!chat || !chat.members || !chat.messages) {
    return []
  }

  const { messages, members } = chat
  const chatProps: ChatItemContentProps[] = []

  // First date divider
  chatProps.push(generateDividerProps({ content: getFriendlyDateString(messages[0].date) }))

  for (let i = 0; i < messages.length - 1; i++) {
    const [msg1, msg2] = [messages[i], messages[i + 1]]
    chatProps.push(generateChatMsgProps(msg1, members.get(msg1.from)))

    if (!areSameDay(msg1.date, msg2.date)) {
      // Generating divider when date changes
      chatProps.push(generateDividerProps({ content: getFriendlyDateString(msg2.date) }))
    }
  }

  const lastMsg = messages[messages.length - 1]
  chatProps.push(generateChatMsgProps(lastMsg, members.get(lastMsg.from)))

  // Last read divider
  const myLastMsgIndex = _.findLastIndex(chatProps, item => (item as ChatMessage).mine)
  if (myLastMsgIndex < chatProps.length - 1) {
    chatProps.splice(
      myLastMsgIndex + 1,
      0,
      generateDividerProps({ content: 'Last read', type: 'primary', important: true }),
    )
  }

  return chatProps
}
