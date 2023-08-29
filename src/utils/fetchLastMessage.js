import { useContext, useEffect, useState } from "react"
import apiService from "../app/apiService"
import { ChatContext } from "../contexts/ChatContext"

export const useFetchLatestMessage = (chats) => {
    const { newMessage} = useContext(ChatContext)
    const [latesMessage, setLatesMessage] = useState(null)
    useEffect(() => {
        const getMessages = async() => {
            const response = await apiService.get(`/message/${chats?._id}`)
            if(response.error){
                return console.log("Error getting message...", response.error)
            }
            const latesMessage = response.data[response?.data?.length - 1]
            setLatesMessage(latesMessage)
        }
        getMessages()
    }, [newMessage])
    

  return {latesMessage}
}