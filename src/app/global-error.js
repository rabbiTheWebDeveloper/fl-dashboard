// components/global-error.jsx
'use client'

import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCw, Home, Mail } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function GlobalError({ error, reset }) {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-md mx-auto shadow-lg border-0">
          <CardHeader className="text-center space-y-4 pb-2">
            <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
              <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
              Something went wrong!
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300">
              We encountered an unexpected error. This might be temporary, so please try again.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4 pt-2">
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 text-sm">
              <p className="text-gray-600 dark:text-gray-300 break-words">
                {error.message || "An unknown error occurred"}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                onClick={reset}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => window.location.href = '/'}
                className="flex-1"
              >
                <Home className="mr-2 h-4 w-4" />
                Go Home
              </Button>
            </div>
            
            <div className="text-center pt-2">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Need help?{" "}
                <a 
                  href="mailto:support@example.com" 
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                >
                  <Mail className="mr-1 h-3 w-3" />
                  Contact Support
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}