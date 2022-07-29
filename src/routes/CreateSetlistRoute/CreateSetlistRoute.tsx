import React from "react";
import {Breadcrumbs, FlexBox, MaxHeightContainer, Breadcrumb} from 'components'
import { Route, Routes, useLocation } from "react-router-dom";
import './CreateSetlistRoute.scss'
import { ManualSetlistCreation } from "./ManualSetlistCreation";
import { TypeSelection } from "./TypeSelection";
import { AutoSetlistCreation } from "./AutoSetlistCreation";

export const CreateSetlistRoute = () => {
  const location = useLocation()

  const autoCrumb: Breadcrumb = {
    to: '/create-setlist/auto',
    label: 'Auto-generate'
  }
  const manualCrumb = {
    to: '/create-setlist/manual',
    label: 'Manual'
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
              ]}
            />
          </FlexBox>
        }
      >
        <Routes>
          <Route path="/" element={<TypeSelection />} />
          <Route path="/auto" element={<AutoSetlistCreation onCreate={console.log} />} />
          <Route path="/manual" element={<ManualSetlistCreation />} />
        </Routes>
      </MaxHeightContainer>
    </div>
  )
}
