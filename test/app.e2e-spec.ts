import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { setupApp } from 'src/setup-app';

describe('Complete User and Todo Flow (e2e)', () => {
  let app: INestApplication;
  let jwtToken: string; // To store JWT token for subsequent requests
  let userId: number;
  let todoId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    
    app = moduleFixture.createNestApplication();
    setupApp(app)
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('register and login user', async () => {
    const email = 'testing6@mail.com';
    const password = 'test';
    const name = 'sakata';

    // Register user
    await request(app.getHttpServer())
      .post('/user')
      .send({
        email,
        name,
        password
      })
      .expect(201);

    // Login user
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email,
        password
      })
      .expect(201);
    console.log(loginResponse.body)
    expect(loginResponse.body[0].accessToken).toBeDefined();
    jwtToken = loginResponse.body[0].accessToken;
    userId = loginResponse.body[0].user.id;
  });

  it('update user name', async () => {
    const newName = 'Gintoki';
    await request(app.getHttpServer())
      .put(`/user/${userId}`) // Assuming the user ID is known and is 1

      .set('Authorization', `Bearer ${jwtToken}`)
      .send({
        name: newName
      })
      .expect(200)
      .expect(res => {
        expect(res.body.name).toEqual(newName);
      });
  });

  it('create a todo', async () => {
    const todoTitle = 'Finish the project';
    const response = await request(app.getHttpServer())
      .post('/todos')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({
        title: todoTitle,
        dueDate: new Date().toISOString()
      })
      .expect(201);

    expect(response.body.title).toEqual(todoTitle);
    todoId = response.body.id

  });

  it('update a todo', async () => {
    const updatedTitle = 'Complete the project';
    await request(app.getHttpServer())
      .put(`/todos/${todoId}`) // Assuming the todo ID is known and is 1
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({
        title: updatedTitle
      })
      .expect(200)
      .expect(res => {
        expect(res.body.title).toEqual(updatedTitle);
      });
  });

  it('mark a todo as done', async () => {
    await request(app.getHttpServer())
      .put(`/todos/${todoId}/done`) // Assuming the todo ID is known and is 1
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200)
      .expect(res => {
        expect(res.body.isDone).toEqual(true);
      });
  });
});
