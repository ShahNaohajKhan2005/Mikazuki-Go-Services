import test from 'node:test';import assert from 'node:assert/strict';import {authorized,passwordMatches,sessionToken,sameOrigin} from '../lib/auth.js';
process.env.ADMIN_PASSWORD='test-password-only';process.env.SESSION_SECRET='test-only-session-secret-at-least-32-characters';
const req=(token)=>new Request('https://shop.example/api/listings',{headers:{cookie:'mikazuki_admin='+token,Origin:'https://shop.example'}});
test('admin password and valid session',()=>{assert.equal(passwordMatches('wrong'),false);assert.equal(passwordMatches('test-password-only'),true);assert.equal(authorized(req(sessionToken())),true)});
test('reject tampered and expired cookies',()=>{assert.equal(authorized(req(sessionToken().slice(0,-1)+'!')),false);assert.equal(authorized(req(sessionToken(Date.now()-9*60*60*1000))),false);assert.equal(authorized(new Request('https://shop.example')),false)});
test('cross-origin writes are rejected',()=>{assert.equal(sameOrigin(req(sessionToken())),true);assert.equal(sameOrigin(new Request('https://shop.example',{headers:{Origin:'https://attacker.example'}})),false)});
