import {
  BadGatewayException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import axios from 'axios';
import * as qs from 'qs';
import { CreateScheduleMeetingDto } from './dto/create-schedule-meeting.dto';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class ScheduleMeetingService {
  private readonly calendlyAuthUrl = 'https://auth.calendly.com/oauth/token';
  private readonly calendlyApiBaseUrl = 'https://api.calendly.com';

  // To be called after the user has authorized and your app has received the authorization code.

  async getAccessToken(code: any): Promise<string> {
    try {
      const clientId = process.env.CALENDLY_CLIENT_ID;
      const clientSecret = process.env.CALENDLY_CLIENT_SECRET;
      const redirectUri = process.env.REDIRECT_URI;

      const authString = Buffer.from(`${clientId}:${clientSecret}`).toString(
        'base64',
      );

      // Log the request for debugging
      console.log('Authorization Header:', `Basic ${authString}`);

      // Fix the nested code object
      const authCode = typeof code === 'object' ? code.code : code;

      const requestBody = {
        grant_type: 'authorization_code',
        code: authCode, // Simplified code access
        redirect_uri: redirectUri,
      };

      console.log('Request Body:', requestBody);

      // Make the POST request to Calendly
      const response = await axios.post(
        this.calendlyAuthUrl,
        new URLSearchParams(requestBody).toString(),
        {
          headers: {
            Authorization: `Basic ${authString}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      // Log the response for debugging
      console.log('Access Token Response:', response.data);

      return response.data.access_token;
    } catch (error) {
      console.error('Calendly Auth Error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });

      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Failed to get Calendly access token',
          details: error.response?.data || error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  async getAccessTokenBasic(code: string): Promise<any> {
    const clientId = process.env.CALENDLY_CLIENT_ID;
    const clientSecret = process.env.CALENDLY_CLIENT_SECRET;
    const redirectUri = process.env.REDIRECT_URI;

    const data = qs.stringify({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: redirectUri,
    });

    try {
      const response = await axios.post(
        'https://auth.calendly.com/oauth/token',
        data,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${Buffer.from(
              `${clientId}:${clientSecret}`,
            ).toString('base64')}`,
          },
        },
      );

      return response.data; // The access token will be in this response
    } catch (error) {
      console.error(
        'Error fetching access token:',
        error.response?.data || error.message,
      );
      throw new Error('Unable to fetch access token');
    }
  }

  async getMeetingHost(code: string) {
    try {
      const response = await axios.get(`${this.calendlyApiBaseUrl}/users/me`, {
        headers: {
          Authorization: `Bearer ${code}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error(
        'Error fetching meeting host:',
        error.response?.data || error.message,
      );
      throw new Error('Unable to fetch meeting host');
    }
  }
  async scheduleMeeting(createScheduleMeetingDto: CreateScheduleMeetingDto) {
    const { name, email, dateTime, location, code } = createScheduleMeetingDto;
    const host = await this.getMeetingHost(code);

    try {
      // Convert ISO string data to yyyy-mm-dd format
      const dateConverted = new Date(dateTime);
      if (isNaN(dateConverted.getTime())) {
        throw new Error('Invalid date format provided.');
      }
      const date = dateConverted.toISOString().split('T')[0];

      // Prepare payload
      const payload = {
        name: name,
        host: host.resource.uri,
        duration: 90, // 1 hr 30 mins
        date_setting: {
          type: 'date_range',
          start_date: date,
          end_date: date,
        },
        location: {
          kind: 'physical',
          location: location,
          additional_info: `Meeting with ${name} at ${location} on ${date} at ${dateConverted.toLocaleTimeString()}`,
        },
        time_zone: 'Asia/Kolkata', // India timezone
      };

      // Make API call
      const response = await axios.post(
        `${this.calendlyApiBaseUrl}/one_off_event_types`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${code}`,
            'Content-Type': 'application/json',
          },
        },
      );
      console.log('Payload:', payload);
      console.log('Response:', response.data);

      return response.data;
    } catch (error) {
      console.error('Error scheduling meeting:', {
        message: error.message,
        response: error.response?.data,
        stack: error.stack,
      });
      throw new Error('Unable to schedule meeting');
    }
  }

  // Main entry point for creating a scheduled meeting
  async create(createScheduleMeetingDto: CreateScheduleMeetingDto) {
    return this.scheduleMeeting(createScheduleMeetingDto);
  }
}
