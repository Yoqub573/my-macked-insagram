'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'

export default function CommentsPage() {
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const token = localStorage.getItem('token') // если нужен
        const res = await axios.get(
          'http://37.27.29.18:8003/Post/get-reels?PageNumber=1',
          {
            headers: {
              Authorization: `Bearer ${token}` // если нужно, иначе убрать
            }
          }
        )

        // Берём все комментарии из всех постов
        const allComments = res.data.data.flatMap(post => post.comments)
        setComments(allComments)
      } catch (err) {
        setError(err.response?.data || err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchComments()
  }, [])

  if (loading) return <p>Загрузка комментариев...</p>
  if (error) return <p>Ошибка: {error}</p>

  return (
    <div className='p-10'>
      <h1 className='text-3xl font-bold mb-5'>Комментарии</h1>
      {comments.length === 0 && <p>Комментариев нет</p>}
      <ul className='space-y-4'>
        {comments.map(c => (
          <li key={c.postCommentId} className='border p-4 rounded-lg shadow'>
            <div className='flex items-center gap-2 mb-2'>
              {c.userImage && (
                <img
                  src={`http://37.27.29.18:8003/images/${c.userImage}`}
                  alt={c.userName}
                  className='w-10 h-10 rounded-full object-cover'
                />
              )}
              <h3 className='font-semibold'>{c.userName}</h3>
            </div>
            <p>{c.comment}</p>
            <span className='text-gray-500 text-sm'>
              {new Date(c.dateCommented).toLocaleString()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
