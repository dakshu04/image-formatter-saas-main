"use client"

import { useEffect, useRef, useState } from "react"
import { CldImage } from "next-cloudinary"
import { Home, Scissors, User } from "lucide-react"
import { UserButton, UserProfile } from "@clerk/nextjs"

// 📐 Social media formats
const socialMediaFormats = {
  "Instagram Post": { width: 1080, height: 1080, crop: "fill" },
  "Instagram Story": { width: 1080, height: 1920, crop: "fill" },
  "Facebook Post": { width: 1200, height: 630, crop: "fill" },
  "Twitter Post": { width: 1024, height: 512, crop: "fill" },
  "LinkedIn Post": { width: 1200, height: 627, crop: "fill" },
}
type SocialFormat = keyof typeof socialMediaFormats

export default function Dashboard() {
  const [publicId, setPublicId] = useState<string | null>(null)
  const [bgRemovedUrl, setBgRemovedUrl] = useState<string | null>(null)
  const [selectedFormat, setSelectedFormat] = useState<SocialFormat>("Instagram Post")
  const [isUploading, setIsUploading] = useState(false)
  const [isTransforming, setIsTransforming] = useState(false)
  const [activeTab, setActiveTab] = useState("formatter")
  const imageRef = useRef<HTMLImageElement>(null)

  // Re-run transformation when format changes
  useEffect(() => {
    if (publicId && activeTab === "formatter") setIsTransforming(true)
  }, [selectedFormat, publicId, activeTab])

  // ✅ Handle file upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    setIsUploading(true)

    const formData = new FormData()
    formData.append("file", file)

    try {
      // Different API depending on active tab
      const endpoint =
        activeTab === "bgremover" ? "/api/bg-remover" : "/api/image-upload"

      const response = await fetch(endpoint, { method: "POST", body: formData })
      const data = await response.json()

      if (response.ok) {
        if (activeTab === "bgremover") {
          setPublicId(data.publicId)
          setBgRemovedUrl(data.bgRemovedUrl)
        } else {
          setPublicId(data.publicId)
        }
      } else {
        console.error("Upload failed:", data.error)
      }
    } catch (error) {
      console.error("Upload error:", error)
    } finally {
      setIsUploading(false)
    }
  }

  // ✅ Download logic
  const handleDownload = (url: string, name: string) => {
    fetch(url)
      .then((res) => res.blob())
      .then((blob) => {
        const link = document.createElement("a")
        link.href = URL.createObjectURL(blob)
        link.download = name
        document.body.appendChild(link)
        link.click()
        link.remove()
      })
      .catch((error) => console.error("Download failed:", error))
  }

  return (
    <div className="font-sans flex h-screen bg-yellow-50">
      {/* Sidebar */}
      <div className="w-64 bg-gray-700 shadow-lg flex flex-col">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-white">🖼 Dashboard</h1>
        </div>

        <nav className="flex-1 p-4">
          <button
            onClick={() => setActiveTab("formatter")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
              activeTab === "formatter"
                ? "bg-purple-100 text-black font-medium"
                : "text-white hover:bg-gray-100 hover:text-black"
            }`}
          >
            <Home size={20} />
            Image Formatter
          </button>

          <button
            onClick={() => setActiveTab("bgremover")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
              activeTab === "bgremover"
                ? "bg-purple-100 text-black font-medium"
                : "text-white hover:bg-gray-100 hover:text-black"
            }`}
          >
            <Scissors size={20} />
            Bg Remover
          </button>

          <button
            onClick={() => setActiveTab("profile")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === "profile"
                ? "bg-purple-100 text-black font-medium"
                : "text-white hover:bg-gray-100 hover:text-black"
            }`}
          >
            <User size={20} />
            <UserButton afterSignOutUrl="/" />
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {/* ========== IMAGE FORMATTER TAB ========== */}
        {activeTab === "formatter" && (
          <div className="h-full p-6 overflow-y-auto">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Upload & Controls */}
              <div className="space-y-4">
                <div className="bg-white shadow-md rounded-xl p-4">
                  <h2 className="text-lg font-semibold text-gray-700 mb-3">
                    📤 Upload Image
                  </h2>
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    className="w-full border border-gray-300 rounded-lg p-2 cursor-pointer hover:border-purple-500 transition text-sm"
                  />
                  {isUploading && (
                    <p className="mt-2 text-purple-600 font-medium text-sm">
                      Uploading...
                    </p>
                  )}
                </div>

                {publicId && (
                  <>
                    <div className="bg-white shadow-md rounded-xl p-4">
                      <h2 className="text-lg font-semibold text-gray-700 mb-3">
                        ⚙️ Select Format
                      </h2>
                      <select
                        value={selectedFormat}
                        onChange={(e) =>
                          setSelectedFormat(e.target.value as SocialFormat)
                        }
                        className="w-full p-2 border border-gray-300 rounded-lg text-gray-700 text-sm"
                      >
                        {Object.keys(socialMediaFormats).map((format) => (
                          <option key={format} value={format}>
                            {format} (
                            {socialMediaFormats[format as SocialFormat].width}×
                            {
                              socialMediaFormats[format as SocialFormat].height
                            }
                            )
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="bg-white shadow-md rounded-xl p-4">
                      <button
                        className="w-full px-6 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 hover:scale-105 transform transition duration-300 shadow-lg"
                        onClick={() =>
                          handleDownload(
                            imageRef.current?.src || "",
                            `formatted-${selectedFormat}.jpg`
                          )
                        }
                      >
                        ⬇️ Download for {selectedFormat}
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* Preview */}
              <div className="bg-white shadow-md rounded-xl p-4">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                  👀 Preview
                </h3>
                {publicId ? (
                  <div className="flex justify-center items-center h-full relative">
                    {isTransforming && (
                      <div className="absolute bg-white bg-opacity-70 flex items-center justify-center p-4 rounded-lg z-10">
                        <span className="animate-pulse text-purple-600">
                          Transforming...
                        </span>
                      </div>
                    )}
                    <CldImage
                      width={socialMediaFormats[selectedFormat].width}
                      height={socialMediaFormats[selectedFormat].height}
                      crop={
                        socialMediaFormats[selectedFormat]
                          .crop as "fill" | "crop" | "scale" | "fit" | "pad"
                      }
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
                    <p className="text-gray-500">
                      Upload an image to see preview
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========== BACKGROUND REMOVER TAB ========== */}
        
        {/* ========== BACKGROUND REMOVER TAB ========== */}
{activeTab === "bgremover" && (
  <div className="h-full p-6">
    <div className="bg-white shadow-md rounded-xl p-6 max-w-5xl mx-auto">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">
        ✂️ Background Remover
      </h2>

      {/* Upload */}
      <input
        type="file"
        onChange={handleFileUpload}
        className="w-full border border-gray-300 rounded-lg p-2 cursor-pointer hover:border-purple-500 transition text-sm mb-4"
      />
      {isUploading && (
        <p className="mt-2 text-purple-600 font-medium text-sm">Uploading...</p>
      )}

      {/* Preview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Original Preview */}
        {publicId ? (
          <div className="text-center">
            <h3 className="font-medium text-gray-700 mb-2">📷 Original</h3>
            <CldImage
              width="400"
              height="400"
              crop="fit"
              gravity="auto"
              src={publicId}
              alt="Original upload"
              className="rounded-xl shadow-md mx-auto max-h-[400px] object-contain"
            />
          </div>
        ) : (
          <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-xl h-64">
            <p className="text-gray-500">Upload an image to preview</p>
          </div>
        )}

        {/* Background Removed Preview */}
          {bgRemovedUrl && (
            <div className="text-center">
              <h3 className="font-medium text-gray-700 mb-2">✨ Background Removed</h3>
              <img
                src={bgRemovedUrl}
                alt="Background removed"
                className="rounded-xl shadow-md mx-auto max-h-[400px] object-contain"
              />
              <button
                onClick={() => handleDownload(bgRemovedUrl, "bg-removed-image.png")}
                className="mt-4 px-6 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:scale-105 transform transition duration-300 shadow-lg"
              >
                ⬇️ Download
              </button>
            </div>
                )}
              </div>
            </div>
          </div>
        )}


        {/* ========== PROFILE TAB ========== */}
        {activeTab === "profile" && (
          <div className="h-full flex justify-center items-center p-6">
            <UserProfile />
          </div>
        )}
      </div>
    </div>
  )
}
