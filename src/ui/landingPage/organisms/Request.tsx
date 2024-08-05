import { useEffect, useState } from "react"
import axiosInstance from "../../../service/instance"
import axios from "axios"

interface Request {
    id: string,
    email?: string,
    username?: string,
    details: {
        first_name?: string,
        middle_name?: string,
        last_name?: string
    }
}

const Request = () => {
    const [requests, setRequests] = useState<Request[]>([])
    const [error, setError] = useState<string | null>(null)
    const showRequest = async () => {
        try {
            const response = await axiosInstance.get('/connect/requests', {
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            setRequests(response.data?.viewRequest)
            console.log(response)
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setError(error.response?.data?.message || 'Error while fetching post')
            } else {
                setError('Error while fetching post')
            }
        }
    }

    const AcceptRequest = async (id: string) => {
        try {
            const response = await axiosInstance.patch(`/connect/accept/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                }

            })
            setRequests((prevRequests) => prevRequests.filter((request) => request.id !== id));
            console.log(response)
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setError(error.response?.data?.message || 'Error while fetching post')
            } else {
                setError('Error while fetching post')
            }
        }
    }

    const Reject = async (id: string) => {
        try {
            const response = await axiosInstance.delete(`/connect/reject/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                }

            })
            setRequests((prevRequests) => prevRequests.filter((request) => request.id !== id));
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
        showRequest()
    }, [])
    return (
        <div>
            {error && <p>{error}</p>}
            {requests?.map(request => (
                <div key={request?.id} >
                    <div className="flex gap-2">
                        <p>{request.details?.first_name}</p>
                        <p>{request.details?.middle_name}</p>
                        <p>{request.details?.last_name}</p>
                    </div>

                    <button onClick={() => AcceptRequest(request?.id)} className="border border-black" type="submit">Accept</button>
                    <button onClick={() => Reject(request?.id)} className="border border-black" type="submit">Reject</button>



                </div>
            ))}
        </div>
    )
}


export default Request