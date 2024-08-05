import axios from "axios";
import axiosInstance from "../../../service/instance";
import { useEffect, useState } from "react";

interface Connection {
    id?: string
    email?: string,
    username?: string;
    details: {
        first_name?: string,
        middle_name?: string,
        last_name?: string,
        phone_number?: string
    }
}

const Connection = () => {
    const [connects, setConnects] = useState<Connection[]>([])
    const [error, setError] = useState<string | null>(null)
    const showConnection = async () => {
        try {
            const response = await axiosInstance.get('/connect/friends', {
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            setConnects(response?.data?.friends)
            console.log(response?.data?.friends)
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setError(error.response?.data?.message || 'Error while fetching connection')
            } else {
                setError('Error while fetching connection')
            }
        }
    }
    useEffect(() => {
        showConnection()
    }, [])
    return (
        <div>
            {error && <p>{error}</p>}
            {connects?.map(connect => (
                <div key={connect?.id}>
                    <div key={connect?.id} className="flex gap-2">
                        <p>{connect?.details?.first_name}</p>
                        <p>{connect?.details?.middle_name}</p>
                        <p>{connect?.details?.last_name}</p>
                    </div>
                </div>
            ))}
        </div>
    )

}
export default Connection