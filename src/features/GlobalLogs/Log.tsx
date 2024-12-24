import { Divider, Typography } from '@mui/material'
import GeneralCard from 'components/UI/GeneralCard'
import React from 'react'

type Props = {}

const Log = (props: Props) => {
  return (
    <>
      <GeneralCard title="Log">
        <Typography variant="body2" color="text.secondary" >
          User: Srijan
        </Typography>
        <Typography variant="body2">
          Last Updated Time: 2024-07-02T14:48:00.000Z,
        </Typography>
        <Typography variant="body2" >
          Details:Purchased 2 items worth $30.00
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Typography variant="body2" color="text.secondary" >
          User: Berlin
        </Typography>
        <Typography variant="body2">
          Last Updated Time: 2024-05-24T14:48:00.000Z,
        </Typography>
        <Typography variant="body2" style={{ marginTop: 5 }}>
          Details:Purchased 5 items worth $670.00
        </Typography>
      </GeneralCard>

    </>
  )
}

export default Log;