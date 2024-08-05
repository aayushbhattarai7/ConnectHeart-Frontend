import { useEffect, useState } from 'react'
import axiosInstance from '../../../service/instance';
import axios from 'axios';

interface Post {
    id?: string,
    thought?: string,
    feeling?: string,
    postImage?: PostMedia[],
    comment?: Comment[]
    postIt?: {
        id?: string,
        details: {
            first_name?: string,
            middle_name?: string
            last_name?: string
        }
    },

}
interface Comment {
    id?: string,
    comment?: string
}

interface PostMedia {
    id?: string,
    path?: string
}

interface PostMedia {
    id?: string,
    path?: string
}


const ShowPost = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [error, setError] = useState<string | null>(null)
    const getPost = async () => {
        try {
            const response = await axiosInstance.get('/post', {
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            setPosts(response.data?.posts)
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
        getPost()
    }, [])
    return (
        <div>
            <div>
                {error && <p>{error}</p>}
                {posts?.map(post => (
                    <div key={post?.id}>
                        <div key={post?.postIt?.id}>
                            <div className='flex gap-1' >
                                <p>{post?.postIt?.details?.first_name}</p>
                                <p>{post?.postIt?.details?.middle_name}</p>
                                <p>{post?.postIt?.details?.last_name}</p>

                            </div>
                            <div key={post?.id}>
                                <p className='font-bold'>{post?.thought}</p>
                                <p>{post?.feeling}</p>
                            </div>

                            <div className='flex  w-72 h-w-72'>{post?.postImage?.map(image => (
                                <div key={image?.id}>
                                    <img src={`${image?.path}`} alt={`Image ${image?.id}`} />
                                </div>
                            ))}
                            </div>

                            <div>
                                {post?.comment?.map(cmt => (
                                    <div key={cmt?.id}>
                                        <h1 className='font-bold'>Comment</h1>
                                        <p>{cmt?.comment}</p>
                                    </div>

                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    )
}


export default ShowPost