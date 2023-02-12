import {v4 as uuidv4} from 'uuid'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Moment from 'App/Models/Moment'
import  Application  from '@ioc:Adonis/Core/Application'

export default class MomentsController {

  private validationOptions = {
    types: ['image'],
    size: '2mb'
  }
  // store data
  public async store({request, response}: HttpContextContract){

    const body = request.body()

    const image = request.file('image', this.validationOptions)

    if(image){
      const imageName = `${uuidv4()}.${image.extname}`

      await image.move(Application.tmpPath('uploads'), {
        name: imageName
      })
      body.image = imageName
    }

    const moment = await Moment.create(body)

    response.status(201)

    return{message:'Momento criado com sucesso!!', data: moment}
  }

  // return all data

  public async index() {
    const moments = await Moment.all()

    return{data:moments}
  }
  // return data by ID
  public async show({params}: HttpContextContract){
    const moment = await Moment.findOrFail(params.id)

    return{data: moment}
  }

  // delete data
  public async destroy({params}: HttpContextContract){
    const moment = await Moment.findOrFail(params.id)
    await moment.delete()
    return{message:'Momento deletado',data: moment}
  }
}

