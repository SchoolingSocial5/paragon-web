'use client'
import Link from 'next/link'
import { appendForm } from '@/lib/helpers'
import { validateInputs } from '@/lib/validation'
import { useState, useEffect } from 'react'
import { MessageStore } from '@/src/zustand/notification/Message'
import EmailStore from '@/src/zustand/notification/Email'
import QuillEditor from '@/components/Admin/QuillEditor'
import { useParams } from 'next/navigation'
import NotificationTemplateStore from '@/src/zustand/notification/NotificationTemplate'

const NotificationForm: React.FC = () => {
    const url = '/emails/'
    const { id } = useParams()
    const [name, setName] = useState('')
    const { setMessage } = MessageStore()
    const {
        emailForm,
        results,
        loading,
        setForm,
        getEmail,
        updateItem,
        postItem,
    } = EmailStore()
    const { formData } = NotificationTemplateStore()

    useEffect(() => {
        const initialize = async () => {
            if (id) {
                setName(String(name))
                const existingItem = results.find((item) => item._id === String(id))
                if (existingItem) {
                    EmailStore.setState({ emailForm: existingItem })
                } else {
                    await getEmail(`${url}/${id}`, setMessage)
                }
            }
        }

        initialize()
    }, [id])

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target
        setForm(name as keyof typeof emailForm, value)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        const inputsToValidate = [
            {
                name: 'greetings',
                value: emailForm.greetings,
                rules: { blank: false },
                field: 'Greetings field',
            },
            {
                name: 'content',
                value: emailForm.content,
                rules: { blank: false },
                field: 'Email Content field',
            },
            {
                name: 'picture',
                value: emailForm.picture,
                rules: { blank: false, maxSize: 3 },
                field: 'Email banner',
            },
            {
                name: 'title',
                value: emailForm.title,
                rules: { blank: false, minLength: 3 },
                field: 'Email title field',
            },
            {
                name: 'sendable',
                value: emailForm.sendable,
                rules: { blank: false },
                field: 'Email note field',
            },
            {
                name: 'name',
                value: emailForm.name,
                rules: { blank: true, minLength: 3, maxLength: 1000 },
                field: 'Email name field',
            },
        ]
        const { messages } = validateInputs(inputsToValidate)
        const getFirstNonEmptyMessage = (
            messages: Record<string, string>
        ): string | null => {
            for (const key in messages) {
                if (messages[key].trim() !== '') {
                    return messages[key]
                }
            }
            return null
        }

        const firstNonEmptyMessage = getFirstNonEmptyMessage(messages)
        if (firstNonEmptyMessage) {
            setMessage(firstNonEmptyMessage, false)
            return
        }
        e.preventDefault()
        const data = appendForm(inputsToValidate)
        if (id) {
            updateItem(`${url}${id}/`, data, setMessage, () => NotificationTemplateStore.setState({ isNoteForm: false }))
        } else {
            await postItem(url, data, setMessage, () => NotificationTemplateStore.setState({ isNoteForm: false }))
        }
    }

    return (
        <>
            <div
                onClick={() => {
                    NotificationTemplateStore.setState({ isNoteForm: false })
                }}
                className="fixed h-full w-full z-40 left-0 top-0 bg-black/50 items-center justify-center flex"
            >
                <div onClick={(e) => {
                    e.stopPropagation()
                }} className="card_body sharp">

                    <div className="grid-2 grid-lay">
                        <div className="flex flex-col">
                            <label className="label" htmlFor="">
                                Name
                            </label>
                            <input
                                className="form-input"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                type="text"
                                placeholder="Enter notification name"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="label" htmlFor="">
                                Title
                            </label>
                            <input
                                className="form-input"
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                placeholder="Enter notification title"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="label" htmlFor="">
                                Greetings
                            </label>
                            <input
                                className="form-input"
                                type="text"
                                name="greetings"
                                value={formData.greetings}
                                onChange={handleInputChange}
                                placeholder="Enter notification greeting"
                            />
                        </div>
                    </div>

                    <QuillEditor
                        contentValue={formData.content}
                        onChange={(content) => {
                            NotificationTemplateStore.setState((prev) => {
                                return {
                                    formData: { ...prev.formData, content: content },
                                }
                            })
                        }}
                    />

                    <div className="table_action">
                        {loading ? (
                            <button className="custom_btn">
                                <i className="bi bi-opencollective loading"></i>
                                Processing...
                            </button>
                        ) : (
                            <>
                                <button className="custom_btn ml-2" onClick={handleSubmit}>
                                    Create Notification
                                </button>
                                <Link
                                    href="/admin/company/emails"
                                    className="custom_btn ml-auto "
                                >
                                    Notification Tables
                                </Link>
                            </>
                        )}
                    </div>
                </div></div>
        </>
    )
}

export default NotificationForm
