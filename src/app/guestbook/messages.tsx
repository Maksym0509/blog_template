'use client'

import dayjs from 'dayjs'
import { DefaultSession } from 'next-auth'
import React from 'react'
import { toast } from 'react-hot-toast'
import useSWR from 'swr'

import fetcher from '@/lib/fetcher'

import Image from '@/components/MDXComponents/Image'
import Modal from '@/components/Modal'

import Loader from './loader'

import { Messages } from '@/types'

type MessagesProps = {
  user: DefaultSession['user']
}

const Messages = (props: MessagesProps) => {
  const { user } = props
  const [isDeleting, setIsDeleting] = React.useState(false)

  const { data, isLoading, mutate } = useSWR<Messages>(
    '/api/guestbook',
    fetcher
  )

  const deleteHandler = async (id: string) => {
    setIsDeleting(true)
    const loading = toast.loading('Deleting...')

    const res = await fetch('/api/guestbook', {
      method: 'DELETE',
      body: JSON.stringify({
        id,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!res.ok) {
      const { error } = await res.json()
      setIsDeleting(false)
      toast.dismiss(loading)
      toast.error(error)

      return
    }

    setIsDeleting(false)
    toast.dismiss(loading)
    toast.success('Deleted sucessfully')

    mutate()
  }

  return (
    <div className='mt-10 flex flex-col gap-4'>
      {isLoading && (
        <>
          {Array.from(Array(10).keys()).map((i) => (
            <Loader key={i} />
          ))}
        </>
      )}
      {data?.map((message) => {
        const { id, image, created_by, updated_at, body } = message

        return (
          <div key={id} className='rounded-lg border border-accent-2 p-4'>
            <div className='mb-3 flex gap-3'>
              <Image
                src={image}
                width={40}
                height={40}
                alt={created_by}
                className='h-10 w-10'
                rounded='rounded-full'
              />
              <div className='flex flex-col justify-center gap-px text-sm'>
                <div>{created_by}</div>
                <div className='text-xs text-accent-5'>
                  {dayjs(updated_at).format('YYYY-MM-DD')}
                </div>
              </div>
            </div>
            <div className='break-words pl-[52px]'>{body}</div>
            {user && created_by === user.name && (
              <div className='mt-4 flex justify-end'>
                <Modal>
                  <Modal.Trigger>
                    <button
                      className='rounded-lg border border-black bg-black px-4 py-2 text-white transition-colors duration-300 hover:bg-white hover:text-black dark:border-white dark:bg-white dark:text-black dark:hover:bg-black dark:hover:text-white'
                      disabled={isDeleting}
                      type='button'
                    >
                      Delete
                    </button>
                  </Modal.Trigger>
                  <Modal.Content>
                    <div className='mb-2'>Delete a message</div>
                    <div className='flex justify-end gap-2'>
                      <Modal.Close>
                        <button
                          className='rounded-lg border border-black bg-black px-4 py-2 text-white transition-colors duration-300 hover:bg-white hover:text-black dark:border-white dark:bg-white dark:text-black dark:hover:bg-black dark:hover:text-white'
                          type='button'
                        >
                          Cancel
                        </button>
                      </Modal.Close>
                      <Modal.Close>
                        <button
                          className='rounded-lg border border-black bg-black px-4 py-2 text-white transition-colors duration-300 hover:bg-white hover:text-black dark:border-white dark:bg-white dark:text-black dark:hover:bg-black dark:hover:text-white'
                          onClick={() => deleteHandler(id.toString())}
                          type='button'
                        >
                          Delete
                        </button>
                      </Modal.Close>
                    </div>
                  </Modal.Content>
                </Modal>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default Messages
