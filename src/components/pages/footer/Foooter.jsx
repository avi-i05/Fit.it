import React from 'react'

function Footer() {
  return (
    <footer className="w-full bg-white border-t mt-auto">
      <div className="max-w-full px-6 py-4 flex flex-col sm:flex-row items-center justify-between text-sm text-gray-500">
        
        <p>
          © {new Date().getFullYear()} Admin Dashboard. All rights reserved.
        </p>

        <p className="mt-2 sm:mt-0">
          Built by Team Fit.it
        </p>

      </div>
    </footer>
  )
}

export default Footer
