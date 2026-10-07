export type BlogContentBlock =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'quote'; text: string; attribution?: string }
  | { type: 'list'; items: string[] }
  | { type: 'callout'; title: string; text: string }
  | { type: 'table'; columns: string[]; rows: string[][]; caption?: string };

export type RelatedFeature = { href: string; label: string };

export type BlogPost = {
  slug: string;
  title: string;
  seoTitle: string;
  description: string;
  kicker: string;
  publishedAt: string;
  readTime: string;
  excerpt: string;
  content: BlogContentBlock[];
  relatedFeatures: RelatedFeature[];
};

export const blogPosts: BlogPost[] = [
  {
    "slug": "diwali-2026-lakshmi-puja-muhurat-usa",
    "title": "Diwali 2026: Lakshmi Puja Muhurat for 12 US Cities",
    "seoTitle": "Diwali 2026 Lakshmi Puja Muhurat in the USA, by City",
    "description": "Lakshmi Puja is on Sunday, November 8, 2026. Here is the auspicious window for 12 US cities, worked out from each city's own sunset rather than converted from India time.",
    "kicker": "Diwali 2026",
    "publishedAt": "2026-10-07",
    "readTime": "4 min read",
    "excerpt": "Every year someone converts the muhurat from India and the family ends up planning a 7:24 a.m. puja. Here is the actual Lakshmi Puja window for your city.",
    "relatedFeatures": [
      {
        "href": "/blog/diwali-2026-dates-usa",
        "label": "All five days of Diwali 2026 in the US"
      },
      {
        "href": "/muhurat-finder",
        "label": "Plan another date with the Muhurat Finder"
      },
      {
        "href": "/ask-mihira",
        "label": "Ask Mihira about the puja itself"
      }
    ],
    "content": [
      {
        "type": "callout",
        "title": "The short answer",
        "text": "In the US, Diwali's Lakshmi Puja is on Sunday, November 8, 2026. In most American cities the best window opens about 20 minutes after sunset and lasts a little under two hours. Find your city below."
      },
      {
        "type": "p",
        "text": "It happens every year in the family WhatsApp group. Someone forwards the muhurat from India, someone converts it from IST, and the puja ends up planned for 7:24 in the morning. The Lakshmi Puja window isn't a clock time you can carry from one country to another. It's built from your own sunset, so it has to be worked out for the place you live."
      },
      {
        "type": "h2",
        "text": "How the window is worked out"
      },
      {
        "type": "p",
        "text": "The traditional Lakshmi Puja muhurat is the stretch of evening where three things overlap:"
      },
      {
        "type": "list",
        "items": [
          "Amavasya: the new-moon tithi that makes it Diwali night. In 2026 it runs from 12:59 AM Eastern on November 8 to 2:02 AM Eastern on November 9 (9:59 PM to 11:02 PM Pacific), so it covers the evening of the 8th everywhere in the continental US.",
          "Pradosh Kaal: the first part of the night, starting at your local sunset.",
          "Vrishabha (Taurus) lagna: a fixed sign on the eastern horizon, chosen so that the Lakshmi you welcome stays. In November it rises soon after sunset and lasts just under two hours."
        ]
      },
      {
        "type": "p",
        "text": "Sunset and the rising of Vrishabha both depend on exactly where you are on the map. That's why Boston and Atlanta, which are both on Eastern time, get windows that start more than an hour apart."
      },
      {
        "type": "h2",
        "text": "Lakshmi Puja muhurat, Sunday, November 8, 2026"
      },
      {
        "type": "table",
        "columns": [
          "City",
          "Sunset",
          "Lakshmi Puja muhurat",
          "Pradosh Kaal"
        ],
        "rows": [
          [
            "Bay Area (San Jose)",
            "5:02 PM",
            "5:21 – 7:12 PM",
            "5:02 – 7:46 PM"
          ],
          [
            "Los Angeles",
            "4:53 PM",
            "5:14 – 7:06 PM",
            "4:53 – 7:35 PM"
          ],
          [
            "Seattle",
            "4:41 PM",
            "4:56 – 6:38 PM",
            "4:41 – 7:34 PM"
          ],
          [
            "Phoenix",
            "5:30 PM",
            "5:50 – 7:43 PM",
            "5:30 – 8:11 PM"
          ],
          [
            "Dallas",
            "5:30 PM",
            "5:51 – 7:44 PM",
            "5:30 – 8:10 PM"
          ],
          [
            "Houston",
            "5:29 PM",
            "5:51 – 7:46 PM",
            "5:29 – 8:07 PM"
          ],
          [
            "Austin",
            "5:38 PM",
            "5:59 – 7:54 PM",
            "5:38 – 8:16 PM"
          ],
          [
            "Chicago",
            "4:36 PM",
            "4:54 – 6:41 PM",
            "4:36 – 7:23 PM"
          ],
          [
            "Atlanta",
            "5:39 PM",
            "5:59 – 7:52 PM",
            "5:39 – 8:20 PM"
          ],
          [
            "Washington, DC",
            "5:00 PM",
            "5:19 – 7:08 PM",
            "5:00 – 7:45 PM"
          ],
          [
            "New York / New Jersey",
            "4:46 PM",
            "5:04 – 6:53 PM",
            "4:46 – 7:32 PM"
          ],
          [
            "Boston",
            "4:29 PM",
            "4:46 – 6:33 PM",
            "4:29 – 7:16 PM"
          ]
        ],
        "caption": "All times are local standard time (daylight saving ends November 1). Computed for each city center with the Lahiri ayanamsha. New York / New Jersey uses central New Jersey (Edison). Expect a minute or two of difference across a metro area."
      },
      {
        "type": "h2",
        "text": "If your city isn't on the list"
      },
      {
        "type": "p",
        "text": "Use the closest city on the list and leave ten minutes of slack at each end. Within one metro area the times shift by a minute or two. Across a state they can shift by ten minutes or more."
      },
      {
        "type": "h2",
        "text": "Three mistakes to avoid"
      },
      {
        "type": "list",
        "items": [
          "Converting India's muhurat. 5:54 PM in New Delhi is 7:24 AM in New York, which is nowhere near your sunset, and sunset is what the window is built around.",
          "Copying India's clock time. Delhi's window is 5:54–7:50 PM. If you used those same hours in Boston, about two-thirds of your puja would fall after Boston's window closes at 6:33.",
          "Worrying about the exact minute. The tradition treats all of Pradosh Kaal as the right part of the evening for Lakshmi Puja, and the Vrishabha window is the best part of it. If your family can't sit down until 7:00 PM in New Jersey, you are still inside Pradosh Kaal."
        ]
      },
      {
        "type": "h2",
        "text": "The rest of the week"
      },
      {
        "type": "p",
        "text": "Dhanteras is Friday, November 6. In 2026, two of the five Diwali days fall on a different date in America than in India. The whole week, with a Dhanteras table by city, is in our companion piece, The Five Days of Diwali 2026, on American Time."
      }
    ]
  },
  {
    "slug": "diwali-2026-dates-usa",
    "title": "The Five Days of Diwali 2026, on American Time",
    "seoTitle": "Diwali 2026 Dates in the USA: All Five Days",
    "description": "Dhanteras, Choti Diwali, Lakshmi Puja, Govardhan Puja and Bhai Dooj 2026 for the US, plus the Dhanteras window by city, and why two of the days come earlier here than in India.",
    "kicker": "Diwali 2026",
    "publishedAt": "2026-10-07",
    "readTime": "4 min read",
    "excerpt": "Indian calendars will tell you Govardhan Puja is Tuesday and Bhai Dooj is Wednesday. In the US, both are a day earlier. Here is the whole week, and the reason.",
    "relatedFeatures": [
      {
        "href": "/blog/diwali-2026-lakshmi-puja-muhurat-usa",
        "label": "Lakshmi Puja muhurat by US city"
      },
      {
        "href": "/muhurat-finder",
        "label": "Find a muhurat with the Muhurat Finder"
      },
      {
        "href": "/daily-alignment",
        "label": "Start a Daily Alignment reading"
      }
    ],
    "content": [
      {
        "type": "callout",
        "title": "At a glance",
        "text": "Dhanteras: Fri, Nov 6. Choti Diwali: Sat, Nov 7. Lakshmi Puja: Sun, Nov 8. Govardhan Puja: Mon, Nov 9. Bhai Dooj: Tue, Nov 10. In India, Govardhan Puja and Bhai Dooj each fall one day later."
      },
      {
        "type": "p",
        "text": "Hindu festivals aren't tied to calendar dates. They're tied to tithis, the lunar days. A tithi begins and ends at the same instant everywhere on earth, but that instant lands at a different hour in each place. A festival goes to whichever local day has the right tithi at the right moment. For some festivals that moment is sunrise, for some it's the afternoon, and for Diwali it's the evening. Move twelve time zones west and that moment can land on a different calendar day."
      },
      {
        "type": "h2",
        "text": "The week, day by day"
      },
      {
        "type": "table",
        "columns": [
          "Festival",
          "Date in the US",
          "What decides the day"
        ],
        "rows": [
          [
            "Dhanteras",
            "Friday, Nov 6",
            "Trayodashi during the evening"
          ],
          [
            "Choti Diwali (Naraka Chaturdashi)",
            "Saturday, Nov 7",
            "Chaturdashi before sunrise"
          ],
          [
            "Lakshmi Puja (Diwali)",
            "Sunday, Nov 8",
            "Amavasya during Pradosh Kaal"
          ],
          [
            "Govardhan Puja / Annakut",
            "Monday, Nov 9",
            "Pratipada at sunrise"
          ],
          [
            "Bhai Dooj",
            "Tuesday, Nov 10",
            "Dwitiya in the afternoon"
          ]
        ],
        "caption": "These dates hold in every continental US time zone. In India, Govardhan Puja is Tuesday, November 10 and Bhai Dooj is Wednesday, November 11."
      },
      {
        "type": "h2",
        "text": "Why two days come earlier here"
      },
      {
        "type": "p",
        "text": "The new moon arrives at 2:02 AM Eastern on Monday, November 9, which is 12:32 PM in India. In New Jersey, Monday's sunrise already falls in Pratipada, the first day of the new lunar month, so Govardhan Puja is on Monday. In Delhi, Monday's sunrise is still in Amavasya. Pratipada doesn't start there until lunchtime, so India marks Govardhan Puja on Tuesday."
      },
      {
        "type": "p",
        "text": "Bhai Dooj moves by a day for the same reason. Dwitiya covers Tuesday afternoon everywhere in the US. In India it begins at 2:01 PM on Tuesday, so the first afternoon it fully covers is Wednesday's."
      },
      {
        "type": "p",
        "text": "Neither date is more correct than the other. Each one is right for the sky over the place where it's observed. A sister in Houston can mark Bhai Dooj on her Tuesday and still call her brother in Pune on his Wednesday."
      },
      {
        "type": "h2",
        "text": "Dhanteras: the puja window and the purchase"
      },
      {
        "type": "p",
        "text": "The Dhanteras puja works the same way as Lakshmi Puja: Trayodashi in the evening, ideally while the fixed Vrishabha lagna is rising. For the customary purchase of gold, silver or a new vessel, most families count the whole of Trayodashi as good. In 2026 that runs from 12:01 AM Eastern on Friday, November 6 to 12:19 AM Eastern on Saturday, November 7 (9:01 PM Thursday to 9:19 PM Friday, Pacific)."
      },
      {
        "type": "table",
        "columns": [
          "City",
          "Dhanteras puja, Friday, Nov 6"
        ],
        "rows": [
          [
            "Bay Area (San Jose)",
            "5:29 – 7:20 PM"
          ],
          [
            "Los Angeles",
            "5:22 – 7:14 PM"
          ],
          [
            "Seattle",
            "5:04 – 6:46 PM"
          ],
          [
            "Phoenix",
            "5:58 – 7:51 PM"
          ],
          [
            "Dallas",
            "5:59 – 7:52 PM"
          ],
          [
            "Houston",
            "5:59 – 7:54 PM"
          ],
          [
            "Austin",
            "6:07 – 8:02 PM"
          ],
          [
            "Chicago",
            "5:02 – 6:49 PM"
          ],
          [
            "Atlanta",
            "6:07 – 8:00 PM"
          ],
          [
            "Washington, DC",
            "5:27 – 7:16 PM"
          ],
          [
            "New York / New Jersey",
            "5:12 – 7:01 PM"
          ],
          [
            "Boston",
            "4:54 – 6:41 PM"
          ]
        ],
        "caption": "Local standard time. Window = Pradosh Kaal while Vrishabha lagna rises, during Trayodashi. Lahiri ayanamsha, computed for each city center."
      },
      {
        "type": "h2",
        "text": "One more date to remember"
      },
      {
        "type": "p",
        "text": "Dev Uthani Ekadashi falls on Friday, November 20 in the US. It traditionally ends Chaturmas and reopens the season for weddings and griha pravesh, so if you're closing on a house this fall, that's the date your planning starts from."
      }
    ]
  },
  {
    "slug": "india-panchang-wrong-time-usa",
    "title": "Why the Panchang From India Gives You the Wrong Time in America",
    "seoTitle": "Why an Indian Panchang Is Wrong for the USA",
    "description": "Tithis, Rahu Kaal and muhurats are built from local sunrise and sunset. Here is why converting from IST fails, with real numbers from Diwali 2026.",
    "kicker": "Sacred Timing",
    "publishedAt": "2026-10-07",
    "readTime": "5 min read",
    "excerpt": "A panchang describes the sky over one particular place. If you convert it to another time zone, you get the right sky at the wrong hours. Here is what carries over to the US and what doesn't.",
    "relatedFeatures": [
      {
        "href": "/muhurat-finder",
        "label": "Try the Muhurat Finder"
      },
      {
        "href": "/blog/diwali-2026-lakshmi-puja-muhurat-usa",
        "label": "See Diwali 2026 timings by US city"
      },
      {
        "href": "/ask-mihira",
        "label": "Ask Mihira a timing question"
      }
    ],
    "content": [
      {
        "type": "callout",
        "title": "In one line",
        "text": "A panchang describes the sky over one particular place. Converted to another time zone, it gives you the right sky at the wrong hours."
      },
      {
        "type": "p",
        "text": "Most Indian families in the US get their timings in one of three ways: a wall calendar printed in India, an image forwarded on WhatsApp, or a website that quietly defaults to New Delhi. All three look authoritative, and all three are worked out for someone else's sunrise."
      },
      {
        "type": "h2",
        "text": "Two kinds of numbers in a panchang"
      },
      {
        "type": "p",
        "text": "The five limbs of the panchang (tithi, vara, nakshatra, yoga and karana) look like calendar entries, but they are measurements of the sky. They come in two kinds:"
      },
      {
        "type": "list",
        "items": [
          "Moments that are the same everywhere. A tithi changes when the moon moves another 12 degrees ahead of the sun. That happens at the same instant all over the world: 2:02 AM in New York is 12:32 PM in Delhi. Converting these times between time zones is fine.",
          "Windows tied to your own horizon. Sunrise, sunset, Rahu Kaal, Abhijit, Choghadiya, Pradosh Kaal and the rising lagna are all local. Converting them from IST gives you nonsense, and using India's clock times as they are gives you an answer that is close but wrong."
        ]
      },
      {
        "type": "p",
        "text": "Almost every real decision needs both kinds. The tithi tells you which lunar day it is. Your own sunrise tells you which of your calendar days that tithi belongs to, and your own horizon tells you which hours inside it are good."
      },
      {
        "type": "h2",
        "text": "Three ways it goes wrong"
      },
      {
        "type": "list",
        "items": [
          "Converting from IST. Delhi's Lakshmi Puja window on November 8, 2026 is 5:54–7:50 PM. Converted to Eastern time, that becomes 7:24–9:20 in the morning, nowhere near the sunset the window is built around.",
          "Copying India's clock time. Use 5:54–7:50 PM as-is in Boston and about two-thirds of that time falls after Boston's actual window closes at 6:33 PM.",
          "Getting the wrong day. Some festivals go to the day that has the right tithi at sunrise or in the afternoon. In 2026 that puts Govardhan Puja and Bhai Dooj a day earlier in the US than in India, and a calendar printed in India will show you the Indian dates."
        ]
      },
      {
        "type": "h2",
        "text": "Rahu Kaal: one rule, four answers"
      },
      {
        "type": "p",
        "text": "Rahu Kaal is one-eighth of the daylight hours, and the weekday decides which eighth. On Sunday it's the last eighth before sunset. On Sunday, November 8 that is 3:30–4:46 PM in New Jersey, 3:13–4:29 PM in Boston and 4:17–5:38 PM in Austin. In Delhi it's 4:09–5:31 PM. The rule is the same everywhere, yet the answers differ, and you can't get one from another by changing the time zone."
      },
      {
        "type": "table",
        "columns": [
          "Place",
          "Sunrise",
          "Rahu Kaal, Sun Nov 8"
        ],
        "rows": [
          [
            "New Jersey (Edison)",
            "6:35 AM",
            "3:30 – 4:46 PM"
          ],
          [
            "Boston",
            "6:26 AM",
            "3:13 – 4:29 PM"
          ],
          [
            "Austin",
            "6:50 AM",
            "4:17 – 5:38 PM"
          ],
          [
            "New Delhi",
            "6:38 AM",
            "4:09 – 5:31 PM"
          ]
        ],
        "caption": "Local time in each place."
      },
      {
        "type": "h2",
        "text": "What to do instead"
      },
      {
        "type": "list",
        "items": [
          "Take tithi start and end times from any reliable source and convert them to your time zone. That part carries over.",
          "Work out anything tied to sunrise or sunset for your own city, or use a source that does it for your city.",
          "When the date of a festival matters, check the date where you live instead of assuming it matches India's.",
          "Leave five to ten minutes of slack at both ends of a window. The tradition cares about the window, not the exact second."
        ]
      },
      {
        "type": "p",
        "text": "The people and tools that used to answer \"when?\" for your family, the pandit and the panchang on the wall, were set up for a different horizon. The tradition still applies after you move. The arithmetic just has to be redone for the place you live now."
      }
    ]
  },
  {
    "slug": "griha-pravesh-muhurat-usa",
    "title": "Griha Pravesh in America: Fitting a Muhurat Around Your Closing Date",
    "seoTitle": "Griha Pravesh Muhurat in the USA: A Practical Guide",
    "description": "In the US, a lender sets your closing date, not a panchang. Here is how families separate the closing from the griha pravesh, what the tradition looks for in a date, and the 2026 window to aim for.",
    "kicker": "Sacred Timing",
    "publishedAt": "2026-10-07",
    "readTime": "5 min read",
    "excerpt": "In India you find the muhurat first and plan around it. In America the lender, the title company and the seller's moving truck pick the date for you. Here is how to keep both.",
    "relatedFeatures": [
      {
        "href": "/muhurat-finder",
        "label": "Scan your dates with the Muhurat Finder"
      },
      {
        "href": "/ask-mihira",
        "label": "Ask Mihira about griha pravesh rituals"
      },
      {
        "href": "/blog/diwali-2026-dates-usa",
        "label": "Diwali 2026 dates in the US"
      }
    ],
    "content": [
      {
        "type": "callout",
        "title": "The key idea",
        "text": "You don't have to move in on closing day. Closing transfers the deed, and griha pravesh is the household's first ceremonial entry. The two can be days or weeks apart, and in most American purchases they should be."
      },
      {
        "type": "p",
        "text": "In India the order is simple: find the muhurat first, then plan everything around it. In America it runs the other way. The lender, the title company and the seller's moving truck set your closing date, usually a weekday picked for paperwork reasons. Plenty of families assume that settles it, but it doesn't have to."
      },
      {
        "type": "h2",
        "text": "Keep getting the keys separate from the ceremony"
      },
      {
        "type": "p",
        "text": "Traditionally, griha pravesh marks the household's first formal entry into the home, the moment it starts being lived in. Collecting the keys, getting the floors redone and letting the painters in are not that entry. Many families do something small at closing, such as a diya or a coconut at the threshold, then hold the full griha pravesh on the muhurat and move in properly afterwards. Customs vary by family and region. If yours says not to sleep in the house before the ceremony, plan your lease overlap with that in mind."
      },
      {
        "type": "h2",
        "text": "What the tradition looks for in a date"
      },
      {
        "type": "list",
        "items": [
          "The right season: outside Chaturmas, Kharmas and Adhik Maas.",
          "A supportive tithi. The Rikta tithis (Chaturthi, Navami and Chaturdashi) and Amavasya are generally avoided.",
          "A steady nakshatra such as Rohini, Mrigashira, Uttara Phalguni, Uttara Ashadha, Uttara Bhadrapada, Chitra, Anuradha or Revati.",
          "A good weekday. Tuesday is the one most commonly avoided.",
          "A good lagna at the moment you cross the threshold, ideally a fixed sign. It's the same make-it-stay logic as the Diwali puja."
        ]
      },
      {
        "type": "p",
        "text": "The first four narrow the calendar down to a handful of days each month. The last one depends on your own city, so it has to be worked out locally."
      },
      {
        "type": "h2",
        "text": "The 2026 window, if you're closing before year-end"
      },
      {
        "type": "p",
        "text": "Chaturmas, the four months when the tradition avoids starting new households, ends on Dev Uthani Ekadashi. In the US that falls on Friday, November 20, 2026. The main griha pravesh window runs from then until Kharmas begins, when the Sun enters Sagittarius around December 15–16. Kharmas ends at Makar Sankranti on January 14, 2027."
      },
      {
        "type": "table",
        "columns": [
          "Period",
          "2026–27 dates (US)",
          "Griha pravesh?"
        ],
        "rows": [
          [
            "Chaturmas",
            "Ends Fri, Nov 20",
            "Avoid until it ends"
          ],
          [
            "Main season",
            "Nov 21 – mid-Dec",
            "Yes, the best window this year"
          ],
          [
            "Kharmas",
            "~Dec 16 – Jan 14",
            "Avoid"
          ],
          [
            "After Makar Sankranti",
            "From Jan 15, 2027",
            "Yes, the season reopens"
          ]
        ],
        "caption": "Specific good days inside a season still depend on tithi, nakshatra and your local lagna."
      },
      {
        "type": "p",
        "text": "In practice: if you close in October or early November, you can hold the griha pravesh in late November without paying two rents for long. If you close in mid-December, you're probably looking at mid-January, so it's worth negotiating a later possession date or a short rent-back with the seller rather than rushing the ceremony."
      },
      {
        "type": "h2",
        "text": "Practical details nobody tells you"
      },
      {
        "type": "list",
        "items": [
          "Havan and smoke detectors. A havan in a tightly sealed new home will set off every alarm in the house. Open the windows, keep the fire small and use a proper havan kund on tile or stone. Don't disable the detectors.",
          "Boiling the milk. An electric or induction cooktop is slower than gas, so start it early enough that the milk boils over inside the window.",
          "HOA and condo rules. Some restrict open flames on balconies and in common areas. Check before you plan anything outside.",
          "Booking the priest. He may be an hour's drive away, or joining by video. November weekends fill up fast at temples, so book as soon as you have a date.",
          "A weekday muhurat. Many families take a half day off work. A 30-minute core ceremony inside the window, with guests arriving afterwards, keeps what matters in the tradition."
        ]
      },
      {
        "type": "p",
        "text": "Tell Mihira's Muhurat Finder what you're planning and which dates you can actually manage, and it will rank the windows and explain its reasoning, so you aren't left picking from a forwarded list with no explanation."
      }
    ]
  },
  {
    slug: 'what-is-a-muhurat',
    title: 'What Is a Muhurat, and Why Timing Still Matters',
    seoTitle: 'What Is a Muhurat? Vedic Timing Explained',
    description:
      'A muhurat is a Vedic auspicious-timing window for starting something important. Here is what it actually means, how it is chosen, and why timing still matters today.',
    kicker: 'Sacred Timing',
    publishedAt: '2026-06-02',
    readTime: '7 min read',
    excerpt:
      'A muhurat is not superstition — it is a structured way of asking "is this a good moment to begin?" Here is what the tradition actually says, and how to use it without an astrologer on call.',
    relatedFeatures: [
      { href: '/muhurat-finder', label: 'Try the Muhurat Finder' },
      { href: '/ask-mihira', label: 'Ask Mihira a related question' },
      { href: '/daily-alignment', label: 'Start a Daily Alignment reading' },
    ],
    content: [
      {
        type: 'p',
        text: "If you grew up around Indian weddings, you have probably heard someone say the ceremony has to start at a specific, oddly precise time — 10:47 in the morning, not 11:00. That instruction almost always traces back to a muhurat: a window of time considered favorable for beginning something significant. Weddings are the most visible example, but the same logic has traditionally been applied to housewarmings, launching a business, signing a contract, starting a journey, or even having a difficult conversation.",
      },
      {
        type: 'p',
        text: 'For a lot of people outside that tradition — and for a lot of people raised inside it but now living away from the family members who used to handle this — the whole idea can feel like an opaque ritual performed by someone else on your behalf. You get a date and a time. Nobody tells you why. This piece is about the "why," and about what it actually takes to find a good window yourself.',
      },
      { type: 'h2', text: 'The idea underneath the ritual' },
      {
        type: 'p',
        text: "Vedic timekeeping treats time as textured, not uniform. A minute at dawn is not treated as functionally identical to a minute at midnight, and a day influenced by a particular lunar phase is not treated as identical to a day a few weeks later. Muhurat calculation looks at several layers at once: the tithi (lunar day), the nakshatra (the lunar mansion the moon is transiting), the yoga and karana (combined solar-lunar factors), and the vara (weekday), along with planetary positions relevant to the specific undertaking. A 'good' muhurat is a window where enough of these layers align in a supportive direction for what you are about to do.",
      },
      {
        type: 'p',
        text: "This is a different claim than 'the stars control your fate.' The traditional framing is closer to: some conditions make an undertaking easier to sustain, and some make it harder, and paying attention to timing is one input among several — alongside preparation, intention, and effort — not a replacement for any of them.",
      },
      { type: 'h2', text: 'Why timing advice used to be easy to get, and now is not' },
      {
        type: 'p',
        text: "For most of this tradition's history, you did not calculate a muhurat yourself. A family priest or a trusted local astrologer did it, using a printed panchang (a Vedic almanac) and their own training. That worked well when the person doing the calculation lived down the street, knew your family, and could be asked a follow-up question over tea.",
      },
      {
        type: 'p',
        text: "That arrangement breaks down for a lot of people today — not because the tradition stopped mattering to them, but because the infrastructure around it did not travel. If you moved from Chennai to Toronto, or from Delhi to the Bay Area, the priest who used to handle this for your family is not a phone call away, and the panchang itself is dense enough that reading one cold is genuinely difficult without training.",
      },
      {
        type: 'quote',
        text: 'The tradition did not get less relevant when people moved. The support system around it just did not come with them.',
      },
      { type: 'h2', text: 'What actually goes into a good muhurat check' },
      {
        type: 'p',
        text: 'A useful timing check for a real decision — not a wedding requiring a priest and a full ceremony calendar, but something like "should I sign this lease Thursday or Friday," or "is this a good week to have this conversation" — generally wants to look at a few things in combination rather than any single factor in isolation:',
      },
      {
        type: 'list',
        items: [
          'The category of the undertaking (travel, contracts, relationships, and health each have somewhat different traditional emphases)',
          'The lunar day and whether it favors beginnings or completions',
          'Whether any widely avoided periods fall in the window (certain inauspicious intervals are avoided by convention across most regional traditions)',
          'The broader astrological picture for the days under consideration, not just the single moment',
        ],
      },
      {
        type: 'p',
        text: "This is precisely the kind of layered lookup that is easy for a trained astrologer and difficult for almost everyone else — which is the gap Mihira's Sacred Timing tool is built to close. You describe what you are planning and the date range you are working with, and it scans for the most supportive windows and shows the reasoning behind the recommendation, rather than handing you a time with no explanation.",
      },
      { type: 'h2', text: 'Timing is an input, not a substitute for judgment' },
      {
        type: 'p',
        text: 'It is worth being direct about what this is not. A supportive muhurat does not guarantee a good outcome, and an inconvenient one does not doom an undertaking. The traditional view has always paired timing with effort, preparation, and right conduct — it was never meant to stand in for any of those. Treat it the way you would treat any other input to a decision: useful context, not an oracle.',
      },
      {
        type: 'p',
        text: "If this is the first time you have looked closely at how muhurat calculation actually works, the practical next step is simple: pick something you are already planning — a move, a launch, a hard conversation — and run it through Mihira's Muhurat Finder to see the reasoning for yourself, alongside a daily reading in Daily Alignment and scripture-grounded guidance in Ask Mihira for the decision itself, not just its timing.",
      },
    ],
  },
  {
    slug: 'decisions-without-an-astrologer',
    title: "How to Make a Big Decision When There's No Astrologer to Call",
    seoTitle: 'Big Decisions Without an Astrologer On Call',
    description:
      'For the diaspora, the family astrologer or priest who used to help with big decisions is rarely nearby. Here is how to rebuild that kind of steadier decision-making on your own.',
    kicker: 'Diaspora Life',
    publishedAt: '2026-06-16',
    readTime: '8 min read',
    excerpt:
      'When you move away from the people who used to help you think through big decisions, you do not just lose convenience — you lose a whole decision-making structure. Here is how to rebuild it.',
    relatedFeatures: [
      { href: '/ask-mihira', label: 'Bring your question to Ask Mihira' },
      { href: '/muhurat-finder', label: 'Check timing with the Muhurat Finder' },
      { href: '/daily-alignment', label: 'Build a Daily Alignment habit' },
    ],
    content: [
      {
        type: 'p',
        text: "There is a specific kind of loneliness that shows up around big decisions — not the everyday kind, but the ones that actually reroute a life. Whether to take the job that would disappoint your parents. Whether to leave the relationship. Whether to move again, or finally stop moving. Growing up, a lot of people had somewhere to take questions like that: an astrologer the family trusted, a priest at the local temple, an elder who had seen enough of life to offer perspective. Move to a new country, and that entire support structure usually does not come with you.",
      },
      {
        type: 'p',
        text: 'This is not really about missing a service. It is about missing a way of thinking something through that is slower and steadier than a group chat, and more grounded than a generic productivity framework built for optimizing a calendar rather than sitting with a hard question.',
      },
      { type: 'h2', text: 'What the old structure was actually doing for you' },
      {
        type: 'p',
        text: 'It is worth naming what that support system actually provided, because most replacements miss the point entirely. It was rarely about getting a definitive answer. A good astrologer or elder was not handing down a verdict — they were offering a frame: relevant scripture or precedent, a sense of timing, and permission to sit with ambiguity instead of forcing a premature resolution. The value was in the process of being walked through the question, not in outsourcing the decision itself.',
      },
      {
        type: 'p',
        text: "That is a meaningfully different thing from what most people substitute in its place — a friend who means well but has no grounding in the tradition you grew up with, or a search engine that returns either dry academic summaries of scripture or, at the other extreme, horoscope-column content with no substance behind it.",
      },
      { type: 'h2', text: 'Three things worth rebuilding deliberately' },
      {
        type: 'list',
        items: [
          "A source of grounded perspective — something that can bring the Gita, the Upanishads, or relevant teaching to a specific question, with a citation you can actually check, not a vague paraphrase",
          'A daily rhythm — a short, consistent practice that keeps you oriented day to day, so big decisions are not the only moments you engage with any of this',
          'A sense of timing — a way to ask "is this a good window to act," even when there is no local priest to consult a panchang for you',
        ],
      },
      {
        type: 'p',
        text: "These three map fairly directly onto Ask Mihira, Daily Alignment, and Sacred Timing. That is not a coincidence — the product was built around the actual shape of what was missing, not around a generic wellness-app feature list. Ask Mihira exists for the first one: bring a real question — duty, a relationship, ambition, grief — and get guidance grounded in the wider canon (Upanishads, Puranas, the epics, and the saints' commentary, not just the Gita), with sources cited and one clear practice to try, rather than a mystical-sounding non-answer.",
      },
      { type: 'h2', text: 'A framework for the decision itself' },
      {
        type: 'p',
        text: 'When there is no elder to walk you through it, a simple structure helps more than it sounds like it would. Before consulting anything else, try answering three questions in writing:',
      },
      {
        type: 'list',
        items: [
          'What is actually at stake, separated from what you are afraid other people will think',
          'Which of your obligations (to yourself, to family, to work) are genuinely in tension here, versus just feeling that way',
          'What you would tell a friend in your exact position, with none of your attachment to the outcome',
        ],
      },
      {
        type: 'quote',
        text: 'A famous line from the Gita puts it plainly: you have a right to your actions, never to their fruits. That reframing alone — focus on right action, release the grip on the outcome — is often more useful than any single piece of advice.',
        attribution: 'Bhagavad Gita 2.47 (paraphrased)',
      },
      {
        type: 'p',
        text: 'Once you have that written down, that is the right moment to bring the question to something like Ask Mihira — not as a replacement for your own thinking, but as the equivalent of the conversation you would have had with someone who had both distance from your situation and depth in the tradition.',
      },
      { type: 'h2', text: 'Timing still matters, even for practical decisions' },
      {
        type: 'p',
        text: "It is easy to assume timing only matters for weddings. In practice, plenty of people quietly wonder whether this week or next is the better one to hand in notice, sign a lease, or have a difficult conversation with a parent. There is no obligation to treat that as make-or-break, but there is also no reason to ignore it just because there is no family astrologer around to ask. That is exactly what Sacred Timing is for — describe what you are planning, scan a date range, and see the reasoning behind the recommended window.",
      },
      {
        type: 'p',
        text: "None of this replaces the value of a real elder, a real priest, or a real conversation with someone who knows you well, if you have access to one. What it does is close the gap for the days when you do not — which, for a lot of the diaspora, is most days.",
      },
    ],
  },
  {
    slug: 'dharma-vs-ambition',
    title: 'Duty or Ambition? What the Gita Actually Says About the Tension',
    seoTitle: 'Dharma vs. Ambition: What the Gita Says',
    description:
      "Torn between what you're supposed to do and what you want to do? The Bhagavad Gita's teaching on dharma is more useful here than the usual \"follow your passion\" advice.",
    kicker: 'Guidance',
    publishedAt: '2026-06-30',
    readTime: '7 min read',
    excerpt:
      'Career advice tells you to follow your ambition. Family expectation tells you to honor your duty. The Gita frames the question itself differently — and that reframing is the useful part.',
    relatedFeatures: [
      { href: '/ask-mihira', label: 'Ask Mihira about your situation' },
      { href: '/daily-alignment', label: 'Start a Daily Alignment reading' },
    ],
    content: [
      {
        type: 'p',
        text: 'Take the job that pays more but pulls you away from your family, or stay close and take the safer path. Pursue the thing you actually want, or the thing that is expected of you. Most modern career advice resolves this in one direction — follow your ambition, your passion, your own path — while a lot of family pressure resolves it in the other: duty, responsibility, what is owed to the people who raised you.',
      },
      {
        type: 'p',
        text: 'The Bhagavad Gita is often summarized as being about duty over desire, which makes it sound like it simply sides with the family-expectation side of that argument. That summary misses the actual structure of the teaching, and the structure is the useful part.',
      },
      { type: 'h2', text: 'The setting the teaching is embedded in' },
      {
        type: 'p',
        text: "The Gita opens with Arjuna, a warrior, standing on a battlefield he is obligated to fight on, looking at relatives and teachers on the opposing side and losing the will to act at all. His crisis is not that he does not know his duty — he knows exactly what is expected of him. His crisis is that knowing his duty is not enough to make acting on it feel bearable. That is a very different starting point from 'should I follow my passion or my obligations,' and it is closer to a feeling a lot of people actually have: knowing the responsible thing to do and still feeling paralyzed about doing it.",
      },
      {
        type: 'p',
        text: "Krishna's response is not 'stop thinking and just do your duty.' It is a layered argument about the nature of action itself, and the most quoted piece of it reframes the entire question: you have a right to your actions, never to their fruits — so let go of attachment to outcomes, and act well anyway (Bhagavad Gita 2.47). That single reframe does more work than it looks like at first. It does not resolve duty versus ambition by picking a side. It changes what you are optimizing for.",
      },
      { type: 'h2', text: 'Dharma is not the same as obligation' },
      {
        type: 'p',
        text: "A common mistranslation treats dharma as simply meaning duty in the narrow sense of 'what people expect of you.' The concept is closer to 'the right action for who you actually are, in the situation you are actually in' — which includes your talents, your role, and your circumstances, not only external expectation. The Gita's own famous line on this point is blunt: it is better to do your own dharma imperfectly than another's dharma well (Bhagavad Gita 3.35). That is not an argument for obedience to family expectation over personal ambition. It is an argument against performing a life that is not actually yours, whichever direction the pressure to perform it is coming from.",
      },
      {
        type: 'quote',
        text: 'Better one’s own duty, though imperfectly performed, than the duty of another well performed.',
        attribution: 'Bhagavad Gita 3.35 (paraphrased)',
      },
      { type: 'h2', text: 'What this actually gives you when the choice is in front of you' },
      {
        type: 'p',
        text: "Applied to a real decision — the safer job near family versus the ambitious one far away, say — the teaching does not hand you an answer. It changes two things about how you approach the question. First, it asks you to separate the decision from your grip on how it turns out: choose based on what is actually right for you to do, not based on guaranteeing a particular result, because the result was never fully yours to control anyway. Second, it asks whether either option is actually dharma for you specifically, or whether both are someone else's script — the ambition script handed to you by career culture, or the duty script handed to you by family expectation — with your own read on the situation missing from both.",
      },
      {
        type: 'list',
        items: [
          'Notice which option you are drawn to out of fear of judgment, versus genuine fit',
          'Ask what you would choose if you were certain no one would find out either way',
          'Separate the decision itself from your attachment to how it is received',
        ],
      },
      {
        type: 'p',
        text: "This is exactly the kind of question Ask Mihira is built for — not a yes/no verdict, but scripture-grounded reasoning applied to the actual shape of your situation, with the sources cited so you can check them yourself rather than take a stranger's paraphrase on faith. Pair it with a Daily Alignment reading in the weeks you are actually deciding, so the question does not just get resolved once and then forgotten under the next wave of pressure.",
      },
    ],
  },
  {
    slug: 'grief-ritual-distance',
    title: 'Grief, Ritual, and Distance: Vedic Guidance for Life Far From Home',
    seoTitle: 'Grief and Vedic Ritual When Living Abroad',
    description:
      'Vedic tradition treats grief with specific rituals and timing. Here is what that framework offers when you are grieving far from the temple, priest, or family who would normally guide you through it.',
    kicker: 'Diaspora Life',
    publishedAt: '2026-07-08',
    readTime: '8 min read',
    excerpt:
      "Losing someone is hard enough. Losing them without the ritual structure your family would normally lean on adds a second, quieter loss. Here is what that structure was for, and how to hold onto its substance from a distance.",
    relatedFeatures: [
      { href: '/ask-mihira', label: 'Bring your grief question to Ask Mihira' },
      { href: '/muhurat-finder', label: 'Time an observance with the Muhurat Finder' },
      { href: '/daily-alignment', label: 'Ground each day with Daily Alignment' },
    ],
    content: [
      {
        type: 'p',
        text: "When someone dies in a family with Vedic roots, there is usually a structure waiting to receive the grief: specific rites at specific intervals, a priest who knows the sequence, relatives who show up because they know what is expected of them without being asked. Living away from that — in a city where none of it is close by, where you might be the only person in your building who even knows what a shraddha ceremony is — does not remove the grief. It removes the container the grief was supposed to sit inside.",
      },
      {
        type: 'p',
        text: 'That is a real, specific loss on top of the loss of the person, and it rarely gets named directly. This piece is about naming it, and about what is actually possible to preserve when the full traditional structure is not.',
      },
      { type: 'h2', text: 'What the traditional structure was doing' },
      {
        type: 'p',
        text: "Vedic mourning practice is built around timed rituals rather than a single funeral — most visibly the antyeshti (the last rites themselves) and the shraddha rites that follow at specified intervals, traditionally including one around the thirteenth day and annual observances afterward. The specifics vary by region and family tradition, but the underlying logic is consistent: grief is not treated as a single event to get through, but as a process that unfolds over a defined period, with the community showing up at defined points rather than only once, at the funeral, and then leaving the grieving person alone with it.",
      },
      {
        type: 'p',
        text: 'That staged structure does real psychological work, independent of anyone\'s specific beliefs about the rites themselves. It gives grief a shape and a known ending point, rather than leaving it open-ended and formless. It also gives other people a script for showing up — they know that the thirteenth day matters, so they call, or visit, or send something, at a moment when the person grieving might otherwise assume everyone has already moved on.',
      },
      { type: 'h2', text: 'What actually gets lost with distance, and what does not have to' },
      {
        type: 'p',
        text: 'Living far from a temple or a family priest usually means the literal rites are hard or impossible to perform in full. What does not have to be lost is the underlying logic: marking time deliberately, returning to the loss at intervals rather than pretending a single day resolves it, and having somewhere to bring the specific, unresolved questions grief tends to produce — not "how do I feel better," but the harder ones. What do I owe someone who is gone. Whether I said what needed saying. What happens to a relationship when one side of it ends.',
      },
      {
        type: 'quote',
        text: 'The Isha Upanishad opens by asking how to live fully while accepting impermanence — not by resolving the tension, but by holding both at once.',
      },
      {
        type: 'p',
        text: "These are the kinds of questions Ask Mihira is built to sit with — bringing the Upanishads, the epics, and the saints' commentary to a grief question specifically, rather than generic comfort language, with sources cited so the guidance can be checked rather than taken on faith. A Daily Alignment reading in the weeks after a loss can also stand in, in a small way, for the community check-ins the traditional structure used to guarantee — a reason to pause and orient once a day, rather than white-knuckling through it alone.",
      },
      { type: 'h2', text: 'On timing, for those who want it' },
      {
        type: 'p',
        text: "For families who do want to observe specific rites — a thirteenth-day observance, an annual shraddha — even from a distance, timing still matters in the traditional framework, and Sacred Timing can help identify the right dates based on the details of the loss, the same way it would for any other significant undertaking. It will not replace a priest who has performed the rite hundreds of times, but for anyone without access to one, it closes some of that gap rather than leaving the question unanswered entirely.",
      },
      {
        type: 'p',
        text: 'None of this makes the distance from home smaller. What it can do is keep the substance of a structure that was built, across a very long time, specifically to help people carry this — even when the exact form it used to take is no longer available to you.',
      },
    ],
  },
];

export function getSortedBlogPosts() {
  return [...blogPosts].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function getBlogPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}
