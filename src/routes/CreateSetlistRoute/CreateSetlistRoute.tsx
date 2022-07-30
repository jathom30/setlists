import React, { useState } from "react";
import {Breadcrumbs, FlexBox, MaxHeightContainer} from 'components'
import { Route, Routes, useLocation } from "react-router-dom";
import './CreateSetlistRoute.scss'
import { ManualSetlistCreation } from "./ManualSetlistCreation";
import { TypeSelection } from "./TypeSelection";
import { AutoSetlistCreation } from "./AutoSetlistCreation";
import { Song } from "typings";
import { AutoGenTempDisplay } from "./AutoGenTempDisplay";

export const CreateSetlistRoute = () => {
  const location = useLocation()
  const [autoSets, setAutoSets] = useState<Record<string, Song[]>>({})
  const [autoName, setAutoName] = useState('')

  const autoCrumb = {
    to: '/create-setlist/auto',
    label: 'Auto-generate'
  }
  const tempCrumb = {
    to: '/create-setlist/auto/temp',
    label: 'Temp'
  }
  const manualCrumb = {
    to: '/create-setlist/manual',
    label: 'Manual'
  }

  const handleSubmitAuto = (sets: Record<string, Song[]>, name: string) => {
    setAutoSets(sets)
    setAutoName(name)
  }

  return (
    <div className="CreateSetlistRoute">
      <MaxHeightContainer
        fullHeight
        header={
          <FlexBox padding="1rem">
            <Breadcrumbs
              crumbs={[
                {
                  to: '/setlists',
                  label: 'Setlists'
                },
                {
                  to: '/create-setlist',
                  label: 'Create setlist'
                },
                ...(location.pathname.includes('auto') ? [autoCrumb] : []),
                ...(location.pathname.includes('manual') ? [manualCrumb] : []),
                ...(location.pathname.includes('temp') ? [tempCrumb] : [])
              ]}
            />
          </FlexBox>
        }
      >
        <Routes>
          <Route path="/" element={<TypeSelection />} />
          <Route path="/auto" element={<AutoSetlistCreation onSubmit={handleSubmitAuto} />} />
          <Route path="/auto/temp" element={<AutoGenTempDisplay initialSets={autoSets} name={autoName} />} />
          <Route path="/manual" element={<ManualSetlistCreation />} />
        </Routes>
      </MaxHeightContainer>
    </div>
  )
}
