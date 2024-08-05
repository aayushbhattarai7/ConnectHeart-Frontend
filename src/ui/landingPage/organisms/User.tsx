import { useEffect, useState } from "react"
import axiosInstance from "../../../service/instance"
import axios from "axios"


interface Connection {
    id: string,
    email?: string,
    username?: string,
    details: {
        first_name?: string,
        middle_name?: string,
        last_name?: string

    }
}

const User = () => {
    const [users, setUsers] = useState<Connection[]>([])
    const [error, setError] = useState<string | null>(null)
    const showUsers = async () => {
        try {
            const response = await axiosInstance.get('/connect/suggestion', {
                headers: {
                    'Content-Type': 'application/json',

                }
            })
            setUsers(response?.data?.user)
            console.log(response?.data?.user)
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setError(error.response?.data?.message || 'Error while fetching post')
            } else {
                setError('Error while fetching users')
            }
        }
    }

    const sendRequest = async(id:string) => {
        try {
            const response = await axiosInstance.post(`/connect/${id}`)
            setUsers((prevRequests) => prevRequests.filter((user) => user.id !== id));
            console.log(response)
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setError(error.response?.data?.message || 'Error while fetching post')
            } else {
                setError('Error while fetching post')
            }
        }
    }

    useEffect(() => {
        showUsers()
    }, [])

    return (
        <>
        {error && <p>{error}</p>}
        {users?.map(user => (
            <div key={user?.id}>
                <div className="flex gap-2">
                    <p>{user?.details?.first_name}</p>
                    <p>{user?.details?.middle_name}</p>
                    <p>{user?.details?.last_name}</p>
                </div>
                <button className="border border-black" onClick={() =>sendRequest(user?.id)}>Send</button>
            </div>
        ))}
        </>
    )
}
export default User