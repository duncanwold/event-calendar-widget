# PianoFight Event Calendar Widget

A custom-built calendar widget for displaying theater events with search, filtering, and date navigation capabilities.

## Overview

PianoFight needed a way to display their upcoming events in an intuitive, searchable calendar format on their website. At the time, Eventbrite didn't offer a suitable out-of-the-box calendar widget that met our needs, so I built a custom solution that integrates with their event data API.

## The Problem

- **No native Eventbrite calendar widget** with the features we needed
- Events needed to be **searchable and filterable** by category, date, and price
- Users wanted to see events **organized by date** with detailed information
- The calendar needed to be **responsive** and work on mobile devices
- We needed **analytics tracking** to understand user behavior

## The Solution

A JavaScript-powered calendar widget that:
- Fetches live event data from Eventbrite's JSON feed
- Displays events organized chronologically by date
- Provides real-time search with highlighting
- Filters by category, date, and price (including free events)
- Handles URL query parameters for deep linking
- Integrates with Google Analytics for tracking
- Automatically handles timezone conversions (PST)
- Updates dynamically without page refreshes

## Key Features

### 1. **Smart Search with Highlighting**
- Real-time search across event names, descriptions, categories, and prices
- Search terms are highlighted in yellow for easy scanning
- Search state persists via URL query parameters

### 2. **Multi-faceted Filtering**
- **Category Filter**: Comedy, Music, Theater, Dance, Film, Other
- **Date Filter**: Custom date picker to jump to specific dates
- **Price Filter**: Toggle to show only free events
- **All filters work together** for precise results

### 3. **Chronological Organization**
- Events automatically grouped by date
- Shows "Today" and "Tomorrow" labels for context
- Displays "Closed" for dates with no events
- Continues through all upcoming events

### 4. **Rich Event Cards**
- Event poster image
- Show name and description
- Category tag (#Comedy, #Music, etc.)
- Price information (including "Free" for RSVP events)
- Show time in 12-hour format
- Direct link to Eventbrite page

### 5. **Analytics Integration**
- Tracks search box usage
- Monitors date picker interactions
- Appends Google Analytics client ID to Eventbrite URLs for attribution
- Includes custom affiliate parameter (`?aff=pfcal`)

### 6. **Technical Optimizations**
- **Cache Busting**: Random query parameters ensure fresh data
- **Timezone Handling**: Automatic PST/PDT conversion
- **Responsive Design**: Adapts to mobile and desktop
- **Performance**: Minimal DOM manipulation, efficient filtering

## Technical Stack

- **Pure JavaScript** - No framework dependencies (jQuery for DOM manipulation)
- **Eventbrite API** - JSON data feed integration
- **Google Analytics** - Event tracking and attribution
- **Responsive CSS** - Mobile-first design

## How It Works

### Data Flow

1. **Fetch**: Load live event data from Eventbrite JSON endpoint
   ```javascript
   xmlHttp.open("GET", "https://www.pianofight.com/internal/eventbrite-data/events-live-min2.JSON?v=" + randomVar, false)
   ```

2. **Parse**: Extract event details (name, date, price, category, image)

3. **Filter**: Apply search terms and filter criteria
   ```javascript
   myEvents[i]["name"].toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
   ```

4. **Organize**: Group events by date
   ```javascript
   dateEvents[eDate.getTime()].push(myEvents[eIndexes[i]]);
   ```

5. **Render**: Build HTML dynamically with highlighted search terms

6. **Track**: Append analytics parameters to outbound links

### Key Functions

- `feedIndexes()` - Initializes event index array
- `filterResults()` - Applies search and filter criteria
- `buildCalendarList()` - Constructs the calendar HTML
- `perShowHtmlList()` - Generates individual event card HTML
- `searchHighlight()` - Highlights search terms in results
- `createDateArray()` - Organizes events by date
- `gimmeADate()` / `gimmeATime()` - Formats dates and times

## URL Query Parameters

The widget supports deep linking via query parameters:

- `?q=comedy` - Pre-fills search box with "comedy"
- `?price=Free` - Shows only free events
- `?category=Music` - Filters to music events
- `?date=2024-12-25` - Jumps to Christmas Day events

Example: `https://pianofight.com/calendar?category=Comedy&price=Free`

## Business Impact

- **Improved Discovery**: Users could easily find events matching their interests
- **Increased Conversions**: Direct links to Eventbrite improved ticket sales
- **Better UX**: No need to leave the PianoFight website to browse events
- **Data Insights**: Analytics tracking showed which events users searched for
- **SEO Benefits**: Calendar provided fresh, indexed content for search engines

## Code Highlights

### Timezone Handling
```javascript
var offset = new Date().getTimezoneOffset();
var PST_offset = offset - 420; // Handles DST automatically
rightNow.setMinutes(rightNow.getMinutes() + PST_offset);
```

### Search Highlighting
```javascript
function searchHighlight(text) {
    var indexSubstring = text.toLowerCase().indexOf(searchTerm.toLowerCase());
    if (indexSubstring > -1) {
        return text.substring(0, indexSubstring) +
               "<span style='background:#ffff99;'>" +
               text.substring(indexSubstring, indexSubstring + searchTerm.length) +
               "</span>" +
               text.substring(indexSubstring + searchTerm.length);
    }
    return text;
}
```

### Google Analytics Integration
```javascript
ga(function(tracker) {
    gaClientId = tracker.get('clientId');
    $('.gaTag').each(function(){
        $(this).attr("href", $(this).attr("href") + "?aff=pfcal&_eboga=" + gaClientId);
    });
});
```

## Setup

1. Include jQuery library
2. Add the JavaScript file to your page
3. Create a container div with id `pf-show-calendar2`
4. Ensure Google Analytics is initialized
5. Point to your Eventbrite JSON data feed

## Future Enhancements

Potential improvements:
- [ ] Add infinite scroll for better performance with many events
- [ ] Include map view showing venue locations
- [ ] Add social sharing buttons per event
- [ ] Implement favorites/bookmarking with localStorage
- [ ] Add "Add to Calendar" functionality (Google/Apple/Outlook)
- [ ] Show capacity indicators (% sold)
- [ ] Add multi-date event support
- [ ] Implement server-side rendering for better SEO

## Lessons Learned

- **Timezone handling is tricky** - DST changes require dynamic offset calculation
- **Cache busting is essential** - Random query parameters ensure users see fresh events
- **Search highlighting improves UX** - Visual feedback helps users understand results
- **URL state is powerful** - Query parameters enable bookmarking and sharing
- **Analytics are crucial** - Tracking user behavior informed product decisions

## Files

- `pf-show-calendar-v2.0.1.js` - Main calendar widget JavaScript
- (HTML and CSS files can be added to show full implementation)

## License

Proprietary - Internal tool for PianoFight San Francisco (RIP)

---

*This project demonstrates practical JavaScript development, API integration, UX design, and problem-solving skills in a real production environment.*
