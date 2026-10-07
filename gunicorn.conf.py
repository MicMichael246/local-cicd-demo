import gunicorn

# Do not advertise the server software version in the Server response header
gunicorn.SERVER = "demo-app"

bind = "0.0.0.0:5000"  # nosec B104
workers = 1
threads = 4
# The container's root filesystem is read-only, so keep worker heartbeat files in memory
worker_tmp_dir = "/dev/shm"

# No management socket: unused here, and the read-only filesystem can't host it
control_socket_disable = True
