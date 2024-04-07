import React from 'react'

function General() {
  return (
    <div className="col-span-8 overflow-hidden rounded-xl sm:bg-gray-50 sm:px-8 sm:shadow">
          <div className="pt-4">
            <h1 className="py-2 text-2xl font-semibold">General settings</h1>
          </div>
          <hr className="mt-4 mb-8" />
          <p className="py-2 text-xl font-semibold">Theme Preference</p>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
<h1>Dark and Light</h1>
          </div>
          <hr className="mt-4 mb-8" />

        </div>
  )
}

export default General