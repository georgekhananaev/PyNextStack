import redis.asyncio as aioredis

from app.components.logger import logger


class AsyncRedisClient:
    _instance = None

    @classmethod
    async def get_instance(cls):
        """
        Asynchronously get the singleton instance of the Redis client.
        """
        if cls._instance is None:
            cls._instance = await cls.create_redis_client()
        return cls._instance

    @staticmethod
    async def create_redis_client():
        """
        Asynchronously create a Redis client. Tries to connect to localhost, redis, and 0.0.0.0.
        """
        hosts = ['localhost', 'redis', '0.0.0.0']
        for host in hosts:
            try:
                client = aioredis.StrictRedis(host=host, port=6379, db=0, decode_responses=True)
                # The ping command is now an awaitable coroutine
                if await client.ping():
                    logger.info(f"Successfully connected to Redis server at {host}")
                    return client
            except aioredis.ConnectionError as e:
                logger.error(f"Could not connect to Redis server at {host}: {e}.")
        raise Exception("Could not connect to any Redis server.")

# # An Redis Lock Example for Future Implementations When Running Multiple Workers
# async def create_initial_users(redis_client):
#     lock_key = "lock_users_creation"  # Unique key for locking
#     expiry_seconds = 120  # Lock expiration time
#
#     try:
#         lock_acquired = await redis_client.set(lock_key, "1", ex=expiry_seconds, nx=True)
#         if lock_acquired:
#             try:
#                 await create_owner()
#             except Exception as e:
#                 logger.error(f"Error during schedule contact update: {e}")
#             await asyncio.sleep(expiry_seconds)
#         else:
#             await asyncio.sleep(30)
#     finally:
#         await redis_client.close()
#         await redis_client.connection_pool.disconnect()
