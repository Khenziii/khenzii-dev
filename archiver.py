import time
import waybackpy
import datetime
import pytz


def log(message: str, prefix: str = 'i'):
    # create a timezone for Warsaw
    warsaw_timezone = pytz.timezone('Europe/Warsaw')

    # get the current time in Warsaw
    warsaw_time = datetime.datetime.now(warsaw_timezone)

    log_record = warsaw_time.strftime(f"[{prefix}] %d/%m/%Y - %H:%M:%S > {message}")
    print(log_record)

def save_page(url, user_agent):
    try:
        wayback_machine = waybackpy.WaybackMachineSaveAPI(url, user_agent)
        wayback_machine.save()

        log(message = f"successfully archived: {url}")
        return True
    except Exception as e:
        log(message = f"something went wrong, here is the error: {e}.", prefix="e")
        return False


### configuration zone! =)
amount_of_times_a_day = 1
# the script will archive these things <amount_of_times_a_day> times a day
list_of_stuff_to_archive = ["https://khenzii.dev/", "https://khenzii.dev/blog", "https://khenzii.dev/projects", "https://khenzii.dev/blog/users"]
user_agent = "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/117.0"


i = 0
archving = True # set this to False if something will go wrong

log(message = f"starting archiving!")

while(archving):
    archving = save_page(list_of_stuff_to_archive[i], user_agent=user_agent)

    # sleep for minute * 60 * 24 (a day) / length of stuff to archive - 60
    # (assuming that the process of archiving takes 60 seconds) / amount_of_times_a_day
    time.sleep((60 * 60 * 24 / len(list_of_stuff_to_archive) - 60) / amount_of_times_a_day)

    if(i+1 < len(list_of_stuff_to_archive)):
        i += 1
    else:
        i = 0


log(message = f"something went wrong.. Stopped archiving.", prefix="e")