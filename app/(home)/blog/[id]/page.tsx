'use client'
import Image from 'next/image'
import { PageHeader } from '@/components/Public/PageBanner'
import BlogStore from '@/src/zustand/Blog'
import { formatDate } from '@/lib/helpers'
import { useEffect } from 'react'
import { useParams } from 'next/navigation'

export default function Blogs() {
  const { blogs, blogForm, getBlog } = BlogStore()
  const { id } = useParams()

  useEffect(() => {
    if (id) {
      if (blogs.length) {
        BlogStore.setState(prev => {
          return {
            blogForm: prev.blogs.find(item => item._id === id)
          }
        })
      } else {
        getBlog(`/blogs/${id}`)
      }
    }
  }, [blogs, id])

  return (
    <div>
      <PageHeader page="Blog" title={blogForm.title} />

      <div className="flex py-[75px] justify-center bg-white">
        <div className="customContainer">
          <Image
            src={blogForm.picture ? String(blogForm.picture) : '/images/page-header.jpg'}
            sizes="100vw"
            className="h-auto w-full object-contain max-w-[600px]"
            width={0}
            height={0}
            alt="real"
          />
        </div>
      </div>
    </div>
  )
}
