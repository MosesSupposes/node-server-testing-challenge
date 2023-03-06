const db = require('../../data/dbClient');
const request = require('supertest');
const server = require('../server')

describe('resource-model', () => {
    beforeEach(async() => {
        await db('resource')
            .truncate();
    })
    
    it('should set testing environment to testing', () => {
        expect(process.env.NODE_ENV).toBe('test')
    })
    
    describe('GET / ', () => {
        it('should return a list of members', async () => {
            let members = await request(server).get('/api');
            expect(members.body).toHaveLength(0);
        })
    })

    describe('POST /', () => {
        it('should add new member to db', async () => {
            let members = await request(server).get('/api');
            expect(members.body).toHaveLength(0);
            
             await request(server).post('/api').send({member: 'merry'})

            members = await request(server).get('/api');
            expect(members.body).toHaveLength(1);
        })

        it('should return a status of 201', async () => {
            const response = await request(server).post('/api').send({member: 'susie'})
            expect(response.status).toBe(201)
        })
    })

    describe('DELETE /:id', () => {
        it('should delete a member from the db', async () => {
            await request(server).post('/api').send({member: 'merry'})
            
            let members = await request(server).get('/api');
            expect(members.body).toHaveLength(1)
            
            await request(server).delete('/api/1')
            members = await request(server).get('/api')
            expect(members.body).toHaveLength(0)
        })

        it ('should return a success messgae upon deletion of member', async () => {
            await request(server).post('/api').send({member: 'Charlie'})
            const response = await request(server).delete('/api/1')
            
            expect(response.body).toEqual({ success: "Successfully removed the member. "})
        })
    })
})