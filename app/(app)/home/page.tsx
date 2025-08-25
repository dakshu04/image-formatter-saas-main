"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { CldImage } from "next-cloudinary"
import { Home, User } from "lucide-react"

const socialMediaFormats = {
  "Instagram Post": { width: 1080, height: 1080, crop: "fill" },
  "Instagram Story": { width: 1080, height: 1920, crop: "fill" },
  "Facebook Post": { width: 1200, height: 630, crop: "fill" },
  "Twitter Post": { width: 1024, height: 512, crop: "fill" },
  "LinkedIn Post": { width: 1200, height: 627, crop: "fill" },
}
type SocialFormat = keyof typeof socialMediaFormats

export default function HomePage() {
  const [publicId, setPublicId] = useState<string | null>(null)
  const [selectedFormat, setSelectedFormat] = useState<SocialFormat>("Instagram Post")
  const [isUploading, setIsUploading] = useState(false)
  const [isTransforming, setIsTransforming] = useState(false)
  const [activeTab, setActiveTab] = useState("home")
  const imageRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    if (publicId) setIsTransforming(true)
  }, [selectedFormat, publicId])

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    setIsUploading(true)

    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await fetch("/api/image-upload", {
        method: "POST",
        body: formData,
      })
      const data = await response.json()
      if (response.ok) setPublicId(data.publicId)
      else console.error("Upload failed:", data.error)
    } catch (error) {
      console.error("Upload error:", error)
    } finally {
      setIsUploading(false)
    }
  }

  const handleDownload = () => {
    if (!imageRef.current) return
    fetch(imageRef.current.src)
      .then((res) => res.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `formatted-image-${selectedFormat.replace(" ", "-").toLowerCase()}.jpg`
        document.body.appendChild(a)
        a.click()
        a.remove()
      })
      .catch((error) => console.error("Download failed:", error))
  }

  return (
    <div className="font-sans flex h-screen bg-gray-50">
      <div className="w-64 bg-white shadow-lg flex flex-col">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-gray-800">🎨 Image Formatter</h1>
        </div>

        <nav className="flex-1 p-4">
          <button
            onClick={() => setActiveTab("home")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
              activeTab === "home" ? "bg-purple-100 text-purple-700 font-medium" : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Home size={20} />
            Home
          </button>

          <button
            onClick={() => setActiveTab("profile")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === "profile" ? "bg-purple-100 text-purple-700 font-medium" : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <User size={20} />
            User Profile
          </button>
        </nav>
      </div>

      <div className="flex-1 overflow-hidden">
        {activeTab === "home" ? (
          <div className="h-full p-6 overflow-y-auto">
            <div className="max-w-6xl mx-auto h-full">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
                {/* Left Column - Controls */}
                <div className="space-y-4">
                  {/* Upload Section */}
                  <div className="bg-white shadow-md rounded-xl p-4">
                    <h2 className="text-lg font-semibold text-gray-700 mb-3">📤 Upload Image</h2>
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      className="w-full border border-gray-300 rounded-lg p-2 cursor-pointer hover:border-purple-500 transition text-sm"
                    />
                    {isUploading && <p className="mt-2 text-purple-600 font-medium text-sm">Uploading...</p>}
                  </div>

                  {/* Format Selector */}
                  {publicId && (
                    <div className="bg-white shadow-md rounded-xl p-4">
                      <h2 className="text-lg font-semibold text-gray-700 mb-3">⚙️ Select Format</h2>
                      <select
                        value={selectedFormat}
                        onChange={(e) => setSelectedFormat(e.target.value as SocialFormat)}
                        className="w-full p-2 border border-gray-300 rounded-lg text-gray-700 text-sm"
                      >
                        {Object.keys(socialMediaFormats).map((format) => (
                          <option key={format} value={format}>
                            {format} ({socialMediaFormats[format as SocialFormat].width}×
                            {socialMediaFormats[format as SocialFormat].height})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Download Button */}
                  {publicId && (
                    <div className="bg-white shadow-md rounded-xl p-4">
                      <button
                        className="w-full px-6 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 hover:scale-105 transform transition duration-300 shadow-lg"
                        onClick={handleDownload}
                      >
                        ⬇️ Download for {selectedFormat}
                      </button>
                    </div>
                  )}
                </div>

                {/* Right Column - Preview */}
                <div className="bg-white shadow-md rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">👀 Preview</h3>
                  {publicId ? (
                    <div className="flex justify-center items-center h-full relative">
                      {isTransforming && (
                        <div className="absolute bg-white bg-opacity-70 flex items-center justify-center p-4 rounded-lg z-10">
                          <span className="animate-pulse text-purple-600">Transforming...</span>
                        </div>
                      )}
                    <CldImage
                        width={socialMediaFormats[selectedFormat].width}
                        height={socialMediaFormats[selectedFormat].height}
                        crop={socialMediaFormats[selectedFormat].crop}
                        gravity="auto"
                        src={publicId}
                        alt="Uploaded preview"
                        ref={imageRef}
                        onLoad={() => setIsTransforming(false)}
                        loading="eager"
                        className="rounded-xl shadow-md max-w-full max-h-[500px] object-contain"
                        />


                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-xl">
                      <p className="text-gray-500">Upload an image to see preview</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Added User Profile tab content */
          <div className="h-full p-6 flex items-center justify-center">
            <div className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full">
              <div className="text-center">
                <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User size={40} className="text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">User Profile</h2>
                <p className="text-gray-600 mb-6">Manage your account settings and preferences</p>
                <button className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
