import { useEffect } from "react";
import apiService from "../app/apiService";
import { useState } from "react";

export const useFetchRecipientUser = (chat, user) => {
    const [recipientUser, setRecipientUser] = useState(null)
    const [error, setError] = useState(null)
  const recipientId =
    user?._id !== chat?.from ? chat?.from : user?._id !== chat?.to ? chat?.to : null;

    useEffect(() => {
        const getUser = async() => {
            if(!recipientId) return null
            const response = await apiService.get(`users/${recipientId}`)
            if(response.error){
                return setError(error)
            }
            setRecipientUser(response.data)
        }   
        getUser() 
    }, [recipientId])

    return {recipientUser}
};
