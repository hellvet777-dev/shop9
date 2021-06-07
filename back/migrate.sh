#!/bin/bash

yarn knex migrate:rollback --all
yarn knex migrate:latest
