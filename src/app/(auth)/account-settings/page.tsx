"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth/auth-provider"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, AlertCircle, ArrowLeft } from "lucide-react"


export default function AccountSettingsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  
  const [displayName, setDisplayName] = useState("")
  const [username, setUsername] = useState("")
  const [bio, setBio] = useState("")
  const [avatarUrl, setAvatarUrl] = useState("")
  const [charsRemaining, setCharsRemaining] = useState(180)
  
  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      router.push("/login")
    } else {
      // Initialize form with user data
      setDisplayName(user.user_metadata?.display_name || "")
      setUsername(user.user_metadata?.username || "")
      setBio(user.user_metadata?.bio || "")
      setAvatarUrl(user.user_metadata?.avatar_url || "")
      setCharsRemaining(180 - (user.user_metadata?.bio?.length || 0))
    }
  }, [user, router])
  
  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value
    setBio(text)
    setCharsRemaining(180 - text.length)
  }
  
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)
    
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          display_name: displayName,
          username,
          bio,
          avatar_url: avatarUrl
        }
      })
      
      if (error) throw error
      
      setSuccess("Profile updated successfully")
      
      // Wait a moment to show the success message, then redirect to home
      setTimeout(() => {
        router.push('/')
        router.refresh()
      }, 1500)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update profile"
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }
  
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !user) return
    
    const file = e.target.files[0]
    
    try {
      setLoading(true)
      setError(null)
      
      // Create form data to send to API
      const formData = new FormData()
      formData.append('file', file)
      formData.append('userId', user.id)
      
      // Add username to make it easier to find the avatar later
      if (username) {
        formData.append('username', username)
      }
      
      // Use our server-side API endpoint to handle the upload
      const response = await fetch('/api/avatar', {
        method: 'POST',
        body: formData,
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload avatar')
      }
      
      // Update local state with the new avatar URL
      setAvatarUrl(data.publicUrl)
      setSuccess('Avatar updated successfully')
    } catch (err) {
      console.error('Avatar upload error:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to update avatar'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }
  
  const handleBackToHome = () => {
    router.push('/')
  };
  
  // Show loading state or redirect if not logged in
  if (!user) {
    return null
  }
  
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-b from-background to-background/80 py-10">
      <div className="mx-auto w-full max-w-md space-y-6 px-4 md:max-w-2xl">
        <div className="flex items-center justify-between mb-4">
          <Button 
            variant="ghost" 
            onClick={handleBackToHome} 
            className="flex items-center gap-1 hover:bg-background/80 rounded-lg"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Button>
        </div>
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">Profile</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Manage how others see you on the platform
          </p>
        </div>
        
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {success && (
          <Alert>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}
        
        <Card className="border border-border/40 shadow-lg rounded-xl overflow-hidden backdrop-blur-sm bg-card/80">
          <CardHeader className="border-b border-border/10">
            <CardTitle className="text-xl">
              Basic Information
            </CardTitle>
            <CardDescription>Update your profile information</CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Avatar Section */}
            <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start sm:gap-4">
              <div className="relative group">
                <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-primary to-primary/60 opacity-75 blur-sm group-hover:opacity-100 transition-opacity"></div>
                <Avatar className="h-20 w-20 relative border-2 border-background shadow-xl">
                  <AvatarImage src={avatarUrl} className="object-cover" />
                  <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-primary/20 to-primary/40">
                    {displayName ? displayName[0].toUpperCase() : username ? username[0].toUpperCase() : user.email ? user.email[0].toUpperCase() : 'U'}
                  </AvatarFallback>
                </Avatar>
                
                <div className="absolute -bottom-2 -right-2">
                  <Label htmlFor="avatar-upload" className="cursor-pointer">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-all hover:scale-110 border-2 border-background">
                      <Upload className="h-5 w-5" />
                    </div>
                  </Label>
                  <Input 
                    id="avatar-upload" 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleAvatarChange}
                  />
                </div>
              </div>
              
              <div className="text-center sm:text-left">
                <h3 className="font-semibold text-lg mb-1">Change Avatar</h3>
                <p className="text-sm text-muted-foreground max-w-xs">
                  Upload a new profile picture or drag and drop an image anywhere on the page
                </p>
              </div>
            </div>
            
            {/* Profile Form */}
            <form onSubmit={handleProfileUpdate} className="space-y-6">
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="display-name" className="text-sm font-medium">Display Name</Label>
                  <div className="relative">
                    <Input
                      id="display-name"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Your display name"
                      className="pl-3 pr-3 py-6 rounded-lg border-border/50 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-sm font-medium">Username</Label>
                  <div className="relative">
                    <Input
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="username"
                      className="pl-3 pr-3 py-6 rounded-lg border-border/50 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-sm font-medium">Bio</Label>
                  <Textarea
                    id="bio"
                    value={bio}
                    onChange={handleBioChange}
                    placeholder="Tell us about yourself"
                    className="resize-none min-h-[120px] rounded-lg border-border/50 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
                    maxLength={180}
                  />
                  <div className="flex justify-end">
                    <span className="inline-block px-2 py-1 text-xs text-muted-foreground bg-muted/50 rounded-md">
                      {charsRemaining} characters remaining
                    </span>
                  </div>
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full py-6 text-base font-medium rounded-lg relative overflow-hidden transition-all" 
                disabled={loading}
              >
                <span className="relative z-10">{loading ? "Saving..." : "Save changes"}</span>
                <span className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 opacity-100"></span>
              </Button>
            </form>
          </CardContent>
        </Card>
        

      </div>
    </div>
  )
}
