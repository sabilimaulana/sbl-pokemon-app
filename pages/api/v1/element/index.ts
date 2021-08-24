import ElementModel from '@server/models/element'
import { Element } from '@server/types/element'
import type { NextApiRequest, NextApiResponse } from 'next'

import dbConnect from '../../../../modules/server/services/dbConnect'

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
  const {method} = req

  await dbConnect()


  switch (method) {
    case 'GET':
      // try {
      //   const users = await User.find({})
      //   res.status(200).json({ success: true, data: users })
      // } catch (error) {
      //   res.status(400).json({ success: false })
      // }
      // break
    case 'POST':
      try {
        const {name} = req.body

        const newElementModel:Element = new ElementModel({
          name
        })

        const newElement = await newElementModel.save()
        const elements = await ElementModel.find()

        res.status(201).json({ status: 'Success', message: 'Add new element successfully', elements })
      } catch (error) {
        res.status(500).json({ status: 'Failed', message: 'Internal Server Error' })
      }
      break
    default:
      res.status(500).json({ status: 'Failed', message: 'Internal Server Error' })
      break
  }


  res.status(200)
}

