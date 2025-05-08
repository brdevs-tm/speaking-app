'use client'

import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'

export default function LoginWarning({ onProceed }) {
  const router = useRouter()

  return (
    <Card className="w-full max-w-md bg-white/90 backdrop-blur-md shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center text-red-600">
          Warning
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-center text-gray-700">
          This page is for admins only. Proceed only if you have admin credentials.
        </p>
        <div className="flex justify-center space-x-4">
          <Button
            onClick={() => router.push('/')}
            variant="outline"
            className="border-red-600 text-red-600 hover:bg-red-100"
          >
            Go Back
          </Button>
          <Button
            onClick={onProceed}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            Proceed
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}